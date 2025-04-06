require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = require('./server');
const { pool } = require('./utils/database');
const { handleMessage } = require('./handlers/messageHandler');
const appStateManager = require('./utils/appStateManager');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'LORD-BOT');
    next();
});

app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

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

app.post('/webhook', async (req, res) => {
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));

    if (req.body.object !== 'page') {
        console.log('Not a page webhook');
        return res.sendStatus(404);
    }

    try {
        for (const entry of req.body.entry) {
            for (const event of entry.messaging) {
                console.log('Processing event:', JSON.stringify(event, null, 2));

                if (!event.message) {
                    console.log('No message in event');
                    continue;
                }

                const sender_id = event.sender.id;
                const message = event.message.text;

                console.log(`Received message from ${sender_id}: ${message}`);

                try {
                    const userResponse = await axios({
                        method: 'get',
                        url: `https://graph.facebook.com/${sender_id}`,
                        params: {
                            fields: 'name',
                            access_token: process.env.PAGE_ACCESS_TOKEN
                        }
                    });

                    console.log('User info:', userResponse.data);

                    await pool.query(
                        `INSERT INTO users (user_id, name) 
                         VALUES ($1, $2) 
                         ON CONFLICT (user_id) 
                         DO UPDATE SET name = EXCLUDED.name`,
                        [sender_id, userResponse.data.name]
                    );

                    const response = await handleMessage(
                        sender_id,
                        message,
                        userResponse.data.name
                    );

                    console.log(`Sending response to ${sender_id}:`, response);

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

                    console.log('Response sent successfully');
                    appStateManager.incrementStat('messagesProcessed');

                } catch (error) {
                    console.error('Error processing message:', error.response?.data || error);
                    
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
                        console.error('Error sending error message:', sendError.response?.data || sendError);
                    }

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
        console.error('Webhook error:', error.response?.data || error);
        res.sendStatus(500);
    }
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/test', async (req, res) => {
    try {
        const testMessage = await handleMessage(
            'test_user',
            '!help',
            'Test User'
        );
        res.json({ success: true, response: testMessage });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

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

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

startServer();