require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const { pool } = require('./utils/database');
const { handleMessage } = require('./handlers/messageHandler');
const appStateManager = require('./utils/appStateManager');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'LORD-BOT');
    next();
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
    if (req.body.object === 'page') {
        try {
            for (const entry of req.body.entry) {
                for (const event of entry.messaging) {
                    if (event.message) {
                        const sender_id = event.sender.id;
                        const message = event.message.text;

                        try {
                            await axios({
                                method: 'post',
                                url: 'https://graph.facebook.com/v18.0/me/messages',
                                params: { access_token: process.env.PAGE_ACCESS_TOKEN },
                                data: {
                                    recipient: { id: sender_id },
                                    sender_action: 'typing_on'
                                }
                            });

                            let response;
                            if (!message) {
                                response = "I can only process text messages. Try typing !help to see what I can do!";
                            } else {
                                response = await handleMessage(sender_id, message, "User");
                            }

                            await axios({
                                method: 'post',
                                url: 'https://graph.facebook.com/v18.0/me/messages',
                                params: { access_token: process.env.PAGE_ACCESS_TOKEN },
                                data: {
                                    recipient: { id: sender_id },
                                    message: { text: response }
                                }
                            });

                        } catch (error) {
                            console.error('Error:', error);
                            await axios({
                                method: 'post',
                                url: 'https://graph.facebook.com/v18.0/me/messages',
                                params: { access_token: process.env.PAGE_ACCESS_TOKEN },
                                data: {
                                    recipient: { id: sender_id },
                                    message: { text: "Hi! I'm here. Type !help to see what I can do!" }
                                }
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Webhook error:', error);
        }
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
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
        `);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Bot started at: ${new Date().toISOString()}`);
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