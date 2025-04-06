const express = require('express');
const path = require('path');
const os = require('os');
const { pool } = require('./utils/database');
const appStateManager = require('./utils/appStateManager');

const app = express();
const startTime = Date.now(); 

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

        const uptime = Math.floor((Date.now() - startTime) / 1000);
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
            totalUsers: stats.rows[0].total_users || 0,
            commandsUsed: stats.rows[0].total_commands || 0,
            messagesHandled: stats.rows[0].total_messages || 0,
            cpuUsage: `${cpuUsage.toFixed(2)}%`,
            memoryUsage: `${memoryUsage}%`,
            lastRestart: new Date(startTime).toLocaleString()
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            status: 'Error',
            uptime: '0h 0m 0s',
            totalUsers: 0,
            commandsUsed: 0,
            messagesHandled: 0,
            cpuUsage: '0%',
            memoryUsage: '0%',
            lastRestart: new Date().toLocaleString()
        });
    }
});

module.exports = app;