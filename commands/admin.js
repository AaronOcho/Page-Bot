const { pool } = require('../utils/database');
const config = require('../config/config');

module.exports = {
    ban: async (sender_id, args) => {
        if (!config.adminIds.includes(sender_id)) return '⚠️ Admin only command';
        if (!args.length) return 'Please tag a user to ban. Usage: !ban @user';
        
        try {
            const targetId = args[0].replace(/[^0-9]/g, '');
            
            
            const userExists = await pool.query('SELECT * FROM users WHERE user_id = $1', [targetId]);
            if (userExists.rows.length === 0) {
                return '❌ User not found';
            }

            
            if (userExists.rows[0].is_banned) {
                return '⚠️ User is already banned';
            }

            
            if (userExists.rows[0].is_admin) {
                return '❌ Cannot ban an admin';
            }

            await pool.query('UPDATE users SET is_banned = true WHERE user_id = $1', [targetId]);
            return `✅ Successfully banned user: ${userExists.rows[0].name}`;
        } catch (error) {
            console.error('Ban error:', error);
            return '❌ Error executing ban command';
        }
    },

    unban: async (sender_id, args) => {
        if (!config.adminIds.includes(sender_id)) return '⚠️ Admin only command';
        if (!args.length) return 'Please tag a user to unban. Usage: !unban @user';
        
        try {
            const targetId = args[0].replace(/[^0-9]/g, '');
            
            
            const userExists = await pool.query('SELECT * FROM users WHERE user_id = $1', [targetId]);
            if (userExists.rows.length === 0) {
                return '❌ User not found';
            }

            
            if (!userExists.rows[0].is_banned) {
                return '⚠️ User is not banned';
            }

            await pool.query('UPDATE users SET is_banned = false WHERE user_id = $1', [targetId]);
            return `✅ Successfully unbanned user: ${userExists.rows[0].name}`;
        } catch (error) {
            console.error('Unban error:', error);
            return '❌ Error executing unban command';
        }
    },

    broadcast: async (sender_id, args) => {
        if (!config.adminIds.includes(sender_id)) return '⚠️ Admin only command';
        if (!args.length) return 'Please provide a message to broadcast. Usage: !broadcast <message>';
        
        try {
            const message = args.join(' ');
            
            
            const users = await pool.query('SELECT user_id FROM users WHERE is_banned = false');
            
            
            await pool.query(
                'INSERT INTO broadcasts (sender_id, message, sent_to_count) VALUES ($1, $2, $3)',
                [sender_id, message, users.rows.length]
            );

            return `✅ Broadcast sent to ${users.rows.length} users:\n\n${message}`;
        } catch (error) {
            console.error('Broadcast error:', error);
            return '❌ Error sending broadcast';
        }
    },

    addAdmin: async (sender_id, args) => {
        if (!config.adminIds.includes(sender_id)) return '⚠️ Admin only command';
        if (!args.length) return 'Please tag a user to make admin. Usage: !addAdmin @user';
        
        try {
            const targetId = args[0].replace(/[^0-9]/g, '');
            
            
            const userExists = await pool.query('SELECT * FROM users WHERE user_id = $1', [targetId]);
            if (userExists.rows.length === 0) {
                return '❌ User not found';
            }

            
            if (userExists.rows[0].is_admin) {
                return '⚠️ User is already an admin';
            }

            await pool.query('UPDATE users SET is_admin = true WHERE user_id = $1', [targetId]);
            return `✅ Successfully made ${userExists.rows[0].name} an admin`;
        } catch (error) {
            console.error('Add admin error:', error);
            return '❌ Error adding admin';
        }
    },

    removeAdmin: async (sender_id, args) => {
        if (!config.adminIds.includes(sender_id)) return '⚠️ Admin only command';
        if (!args.length) return 'Please tag an admin to remove. Usage: !removeAdmin @user';
        
        try {
            const targetId = args[0].replace(/[^0-9]/g, '');
            
            
            const userExists = await pool.query('SELECT * FROM users WHERE user_id = $1', [targetId]);
            if (userExists.rows.length === 0) {
                return '❌ User not found';
            }

            
            if (!userExists.rows[0].is_admin) {
                return '⚠️ User is not an admin';
            }

            
            if (config.adminIds.includes(targetId)) {
                return '❌ Cannot remove super admin';
            }

            await pool.query('UPDATE users SET is_admin = false WHERE user_id = $1', [targetId]);
            return `✅ Successfully removed admin status from ${userExists.rows[0].name}`;
        } catch (error) {
            console.error('Remove admin error:', error);
            return '❌ Error removing admin';
        }
    },

    settings: async (sender_id, args) => {
        if (!config.adminIds.includes(sender_id)) return '⚠️ Admin only command';
        if (args.length < 2) return 'Please provide setting and value. Usage: !settings <setting> <value>';
        
        try {
            const [setting, value] = args;
            const validSettings = ['autoReact', 'autoReply', 'maintenance', 'notifyAdmins'];
            const validValues = ['true', 'false', 'on', 'off'];

            if (!validSettings.includes(setting)) {
                return `❌ Invalid setting. Valid settings are: ${validSettings.join(', ')}`;
            }

            if (!validValues.includes(value.toLowerCase())) {
                return '❌ Invalid value. Use: true/false or on/off';
            }

            const boolValue = value.toLowerCase() === 'true' || value.toLowerCase() === 'on';

            await pool.query(
                'UPDATE bot_settings SET value = $1 WHERE setting = $2',
                [boolValue, setting]
            );

            return `✅ Setting "${setting}" updated to: ${boolValue}`;
        } catch (error) {
            console.error('Settings error:', error);
            return '❌ Error updating settings';
        }
    },

    stats: async (sender_id) => {
        if (!config.adminIds.includes(sender_id)) return '⚠️ Admin only command';
        
        try {
            const stats = await pool.query(`
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN is_banned THEN 1 END) as banned_users,
                    COUNT(CASE WHEN is_admin THEN 1 END) as admin_count,
                    SUM(message_count) as total_messages,
                    SUM(command_count) as total_commands
                FROM users
            `);

            const commandStats = await pool.query(`
                SELECT command, COUNT(*) as usage_count 
                FROM commands_log 
                GROUP BY command 
                ORDER BY usage_count DESC 
                LIMIT 5
            `);

            return `
📊 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦

👥 Users: ${stats.rows[0].total_users}
⚠️ Banned: ${stats.rows[0].banned_users}
👑 Admins: ${stats.rows[0].admin_count}
💭 Messages: ${stats.rows[0].total_messages}
⌨️ Commands: ${stats.rows[0].total_commands}

📈 Top Commands:
${commandStats.rows.map(cmd => `${cmd.command}: ${cmd.usage_count}`).join('\n')}`;
        } catch (error) {
            console.error('Stats error:', error);
            return '❌ Error fetching stats';
        }
    },

    maintenance: async (sender_id, args) => {
        if (!config.adminIds.includes(sender_id)) return '⚠️ Admin only command';
        if (!args.length || !['on', 'off'].includes(args[0].toLowerCase())) {
            return 'Please specify on/off. Usage: !maintenance <on/off>';
        }
        
        try {
            const maintenanceMode = args[0].toLowerCase() === 'on';
            
            await pool.query(
                'UPDATE bot_settings SET value = $1 WHERE setting = \'maintenance\'',
                [maintenanceMode]
            );

            if (maintenanceMode) {
                // Notify all active users about maintenance
                await pool.query(`
                    INSERT INTO notifications (user_id, message, type)
                    SELECT user_id, '⚠️ Bot entering maintenance mode', 'maintenance'
                    FROM users WHERE is_banned = false
                `);
            }

            return `✅ Maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'}`;
        } catch (error) {
            console.error('Maintenance error:', error);
            return '❌ Error updating maintenance mode';
        }
    },

    reset: async (sender_id, args) => {
        if (!config.adminIds.includes(sender_id)) return '⚠️ Admin only command';
        if (!args.length) return 'Please tag a user to reset. Usage: !reset @user';
        
        try {
            const targetId = args[0].replace(/[^0-9]/g, '');
            
            
            const userExists = await pool.query('SELECT * FROM users WHERE user_id = $1', [targetId]);
            if (userExists.rows.length === 0) {
                return '❌ User not found';
            }

            await pool.query(`
                UPDATE users 
                SET message_count = 0, 
                    command_count = 0,
                    last_reset = CURRENT_TIMESTAMP
                WHERE user_id = $1
            `, [targetId]);

            
            await pool.query('DELETE FROM commands_log WHERE user_id = $1', [targetId]);

            return `✅ Successfully reset stats for user: ${userExists.rows[0].name}`;
        } catch (error) {
            console.error('Reset error:', error);
            return '❌ Error resetting user stats';
        }
    }
};