const express = require('express');
const path = require('path');
const os = require('os');
const { pool } = require('./utils/database');
const appStateManager = require('./utils/appStateManager');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/stats', async (req, res) => {
    try {
        const appState = appStateManager.getAppState();
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total_users,
                SUM(command_count) as total_commands,
                SUM(message_count) as total_messages
            FROM users
        `);

        const uptime = Math.floor((new Date() - new Date(appState.stats.lastRestart)) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        const cpuUsage = os.loadavg()[0];
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const memoryUsage = ((totalMemory - freeMemory) / totalMemory * 100).toFixed(2);

        res.json({
            status: appState.botInfo.settings.maintenance ? 'Maintenance' : 'Online',
            uptime: `${hours}h ${minutes}m ${seconds}s`,
            totalUsers: stats.rows[0].total_users,
            commandsUsed: stats.rows[0].total_commands,
            messagesHandled: stats.rows[0].total_messages,
            cpuUsage: `${cpuUsage.toFixed(2)}%`,
            memoryUsage: `${memoryUsage}%`,
            lastRestart: new Date(appState.stats.lastRestart).toLocaleString()
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app;