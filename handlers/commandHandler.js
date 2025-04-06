const adminCommands = require('../commands/admin');
const aiCommands = require('../commands/ai');
const funCommands = require('../commands/fun');
const mediaCommands = require('../commands/media');
const { pool } = require('../utils/database');
const { styleText } = require('../utils/fonts');

const commands = {
    ...adminCommands,
    ...aiCommands,
    ...funCommands,
    ...mediaCommands,

    help: async (sender_id) => {
        const isAdmin = await pool.query('SELECT is_admin FROM users WHERE user_id = $1', [sender_id]);
        
        const helpText = `
╭━━━━━━ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ━━━━━╮

🤖 𝗔𝗜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:
!chatgpt [prompt]
!trixie [prompt]
!dalle [prompt]
!blackbox [prompt]
!gpt4 [prompt]
!deepseek [prompt]

📱 𝗠𝗘𝗗𝗜𝗔 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:
!shoti
!spotify [title]
!flux [prompt]
!fluxweb [prompt]
!cdp
!ba

🎮 𝗙𝗨𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:
!slap [@user1] [@user2]
!kiss [@user1] [@user2]
!billboard [text]
!hangingBillboard [text]

📖 𝗢𝗧𝗛𝗘𝗥𝗦:
!bible [verse]
!help
!profile

${isAdmin.rows[0]?.is_admin ? `
⚡ 𝗔𝗗𝗠𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:
!ban [@user]
!unban [@user]
!broadcast [message]
!addAdmin [@user]
!removeAdmin [@user]
!settings [setting] [value]
!stats
!maintenance [on/off]
!reset [@user]
` : ''}
╰━━━━━━━━━━━━━━━━━━━━╯`;

        return helpText;
    },

    profile: async (sender_id) => {
        try {
            const result = await pool.query(`
                SELECT 
                    name,
                    message_count,
                    command_count,
                    join_date,
                    is_admin,
                    is_banned
                FROM users 
                WHERE user_id = $1
            `, [sender_id]);

            const user = result.rows[0];
            return `
╭━━━ 𝗨𝗦𝗘𝗥 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 ━━━╮
👤 Name: ${styleText(user.name || 'Unknown', 'fancy1')}
📊 Messages: ${user.message_count}
⌨️ Commands: ${user.command_count}
📅 Joined: ${new Date(user.join_date).toLocaleDateString()}
🎭 Role: ${user.is_admin ? '👑 Admin' : '👥 User'}
Status: ${user.is_banned ? '🚫 Banned' : '✅ Active'}
╰━━━━━━━━━━━━━━━━━━╯`;
        } catch (error) {
            return "❌ Error fetching profile";
        }
    }
};

async function execute(command, sender_id, args) {
    try {
        if (commands[command]) {
            await pool.query(
                'INSERT INTO commands_log (user_id, command, args) VALUES ($1, $2, $3)',
                [sender_id, command, args]
            );
            return await commands[command](sender_id, args);
        }
        return `❌ Unknown command. Type !help for commands list.`;
    } catch (error) {
        console.error('Command execution error:', error);
        return "❌ Error executing command";
    }
}

module.exports = { execute };