require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = require('./server');
const { pool } = require('./utils/database');
const { handleMessage } = require('./handlers/messageHandler');
const appStateManager = require('./utils/appStateManager');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'LORD-BOT');
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Webhook verification
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            console.log('Webhook verified');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Message handling
app.post('/webhook', async (req, res) => {
    if (req.body.object !== 'page') {
        return res.sendStatus(404);
    }

    try {
        for (const entry of req.body.entry) {
            for (const event of entry.messaging) {
                if (!event.message) continue;

                const sender_id = event.sender.id;
                const message = event.message.text;

                try {
                    // Get user info
                    const userResponse = await axios({
                        method: 'get',
                        url: `https://graph.facebook.com/${sender_id}`,
                        params: {
                            fields: 'name',
                            access_token: process.env.PAGE_ACCESS_TOKEN
                        }
                    });

                    // Update or create user in database
                    await pool.query(
                        `INSERT INTO users (user_id, name) 
                         VALUES ($1, $2) 
                         ON CONFLICT (user_id) 
                         DO UPDATE SET name = EXCLUDED.name`,
                        [sender_id, userResponse.data.name]
                    );

                    // Handle the message
                    const response = await handleMessage(
                        sender_id,
                        message,
                        userResponse.data.name
                    );

                    // Send response back to user
                    await axios({
                        method: 'post',
                        url: 'https://graph.facebook.com/v18.0/me/messages',
                        params: {
                            access_token: process.env.PAGE_ACCESS_TOKEN
                        },
                        data: {
                            recipient: { id: sender_id },
                            message: { text: response }
                        }
                    });

                    // Update stats
                    appStateManager.incrementStat('messagesProcessed');

                } catch (error) {
                    console.error('Error processing message:', error);
                    
                    // Send error message to user
                    try {
                        await axios({
                            method: 'post',
                            url: 'https://graph.facebook.com/v18.0/me/messages',
                            params: {
                                access_token: process.env.PAGE_ACCESS_TOKEN
                            },
                            data: {
                                recipient: { id: sender_id },
                                message: { 
                                    text: "Sorry, I encountered an error processing your message. Please try again later." 
                                }
                            }
                        });
                    } catch (sendError) {
                        console.error('Error sending error message:', sendError);
                    }

                    // Notify admins if enabled
                    if (appStateManager.getSetting('notifyAdmins')) {
                        for (const adminId of appStateManager.getAppState().botInfo.admins) {
                            try {
                                await axios({
                                    method: 'post',
                                    url: 'https://graph.facebook.com/v18.0/me/messages',
                                    params: {
                                        access_token: process.env.PAGE_ACCESS_TOKEN
                                    },
                                    data: {
                                        recipient: { id: adminId },
                                        message: { 
                                            text: `⚠️ Error processing message from ${sender_id}: ${error.message}` 
                                        }
                                    }
                                });
                            } catch (notifyError) {
                                console.error('Error notifying admin:', notifyError);
                            }
                        }
                    }
                }
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook error:', error);
        res.sendStatus(500);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Initialize database and start server
async function startServer() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                name TEXT,
                message_count INTEGER DEFAULT 0,
                command_count INTEGER DEFAULT 0,
                join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_banned BOOLEAN DEFAULT FALSE,
                is_admin BOOLEAN DEFAULT FALSE,
                settings JSONB DEFAULT '{}'::jsonb
            );

            CREATE TABLE IF NOT EXISTS commands_log (
                id SERIAL PRIMARY KEY,
                user_id TEXT,
                command TEXT,
                args TEXT[],
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                success BOOLEAN DEFAULT true,
                error_message TEXT
            );
        `);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Bot started at: ${new Date().toISOString()}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

startServer();