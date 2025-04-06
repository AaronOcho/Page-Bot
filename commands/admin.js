const { pool } = require('../utils/database');
const appStateManager = require('../utils/appStateManager');
const config = require('../config/config');

module.exports = {
    ban: async (sender_id, args) => {
        try {
            if (!config.adminIds.includes(sender_id)) return "⚠️ Admin access required";
            const userToBan = args[0];
            await pool.query('UPDATE users SET is_banned = true WHERE user_id = $1', [userToBan]);
            return `✅ User ${userToBan} has been banned`;
        } catch (error) {
            return "❌ Error executing ban command";
        }
    },

    unban: async (sender_id, args) => {
        try {
            if (!config.adminIds.includes(sender_id)) return "⚠️ Admin access required";
            const userToUnban = args[0];
            await pool.query('UPDATE users SET is_banned = false WHERE user_id = $1', [userToUnban]);
            return `✅ User ${userToUnban} has been unbanned`;
        } catch (error) {
            return "❌ Error executing unban command";
        }
    },

    broadcast: async (sender_id, args) => {
        try {
            if (!config.adminIds.includes(sender_id)) return "⚠️ Admin access required";
            const message = args.join(' ');
            const users = await pool.query('SELECT user_id FROM users WHERE is_banned = false');
            for (const user of users.rows) {
                await global.sendMessage(user.user_id, message);
            }
            return "✅ Broadcast message sent successfully";
        } catch (error) {
            return "❌ Error broadcasting message";
        }
    },

    addAdmin: async (sender_id, args) => {
        try {
            if (!config.adminIds.includes(sender_id)) return "⚠️ Admin access required";
            const newAdmin = args[0];
            await pool.query('UPDATE users SET is_admin = true WHERE user_id = $1', [newAdmin]);
            const appState = appStateManager.getAppState();
            appState.botInfo.admins.push(newAdmin);
            appStateManager.updateAppState(appState);
            return `✅ User ${newAdmin} is now an admin`;
        } catch (error) {
            return "❌ Error adding admin";
        }
    },

    removeAdmin: async (sender_id, args) => {
        try {
            if (!config.adminIds.includes(sender_id)) return "⚠️ Admin access required";
            const adminToRemove = args[0];
            await pool.query('UPDATE users SET is_admin = false WHERE user_id = $1', [adminToRemove]);
            const appState = appStateManager.getAppState();
            appState.botInfo.admins = appState.botInfo.admins.filter(id => id !== adminToRemove);
            appStateManager.updateAppState(appState);
            return `✅ User ${adminToRemove} is no longer an admin`;
        } catch (error) {
            return "❌ Error removing admin";
        }
    },

    settings: async (sender_id, args) => {
        try {
            if (!config.adminIds.includes(sender_id)) return "⚠️ Admin access required";
            const [setting, value] = args;
            const appState = appStateManager.getAppState();
            appState.botInfo.settings[setting] = value === 'true';
            appStateManager.updateAppState(appState);
            return `✅ Setting ${setting} updated to ${value}`;
        } catch (error) {
            return "❌ Error updating settings";
        }
    },

    stats: async (sender_id) => {
        try {
            if (!config.adminIds.includes(sender_id)) return "⚠️ Admin access required";
            const stats = await pool.query(`
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN is_banned = true THEN 1 END) as banned_users,
                    SUM(message_count) as total_messages,
                    SUM(command_count) as total_commands
                FROM users
            `);
            return `📊 Bot Statistics:
━━━━━━━━━━━━━━━━
👥 Total Users: ${stats.rows[0].total_users}
🚫 Banned Users: ${stats.rows[0].banned_users}
💬 Total Messages: ${stats.rows[0].total_messages}
⌨️ Commands Used: ${stats.rows[0].total_commands}`;
        } catch (error) {
            return "❌ Error fetching stats";
        }
    },

    maintenance: async (sender_id, args) => {
        try {
            if (!config.adminIds.includes(sender_id)) return "⚠️ Admin access required";
            const mode = args[0] === 'on';
            const appState = appStateManager.getAppState();
            appState.botInfo.settings.maintenance = mode;
            appStateManager.updateAppState(appState);
            return `✅ Maintenance mode ${mode ? 'enabled' : 'disabled'}`;
        } catch (error) {
            return "❌ Error toggling maintenance mode";
        }
    },

    reset: async (sender_id, args) => {
        try {
            if (!config.adminIds.includes(sender_id)) return "⚠️ Admin access required";
            const userId = args[0];
            await pool.query('UPDATE users SET message_count = 0, command_count = 0 WHERE user_id = $1', [userId]);
            return `✅ Stats reset for user ${userId}`;
        } catch (error) {
            return "❌ Error resetting user stats";
        }
    }
};