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
    if (req.body.object === 'page') {
        try {
            for (const entry of req.body.entry) {
                for (const event of entry.messaging) {
                    if (event.message) {
                        const sender_id = event.sender.id;
                        const message = event.message.text;

                        // Get user info
                        const userInfo = await axios.get(
                            `https://graph.facebook.com/${sender_id}`,
                            {
                                params: {
                                    access_token: process.env.PAGE_ACCESS_TOKEN,
                                    fields: 'name'
                                }
                            }
                        );

                        // Update or create user in database
                        await pool.query(`
                            INSERT INTO users (user_id, name)
                            VALUES ($1, $2)
                            ON CONFLICT (user_id)
                            DO UPDATE SET name = EXCLUDED.name
                        `, [sender_id, userInfo.data.name]);

                        const response = await handleMessage(
                            sender_id,
                            message,
                            userInfo.data.name
                        );

                        // Send response
                        await axios.post(
                            `https://graph.facebook.com/v13.0/me/messages`,
                            {
                                recipient: { id: sender_id },
                                message: { text: response }
                            },
                            {
                                params: { access_token: process.env.PAGE_ACCESS_TOKEN }
                            }
                        );
                    }
                }
            }
            res.sendStatus(200);
        } catch (error) {
            console.error('Error handling message:', error);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(404);
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
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
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();