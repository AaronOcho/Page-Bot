const { styleText } = require('../utils/fonts');
const appStateManager = require('../utils/appStateManager');
const { pool } = require('../utils/database');
const commandHandler = require('./commandHandler');

async function handleMessage(sender_id, message, userName) {
    if (!message) return "Hi! I'm here. Type !help to see what I can do!";

    try {
        await updateUserStats(sender_id);
        
        const lowercaseMsg = message.toLowerCase();
        
        if (lowercaseMsg === 'hi' || lowercaseMsg === 'hello') {
            return await handleGreeting(sender_id, userName);
        }

        if (message.startsWith('!')) {
            const args = message.slice(1).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            try {
                await pool.query(
                    'UPDATE users SET command_count = command_count + 1 WHERE user_id = $1',
                    [sender_id]
                );
                
                return await commandHandler.execute(command, sender_id, args);
            } catch (error) {
                console.error('Command execution error:', error);
                return "There was an error executing that command. Please try again!";
            }
        }

        return "Hi! Type !help to see what I can do!";

    } catch (error) {
        console.error('Error in handleMessage:', error);
        return "Hi! I'm here. Type !help to see what I can do!";
    }
}

async function updateUserStats(userId) {
    try {
        await pool.query(
            'INSERT INTO users (user_id, message_count) VALUES ($1, 1) ' +
            'ON CONFLICT (user_id) DO UPDATE SET message_count = users.message_count + 1',
            [userId]
        );
    } catch (error) {
        console.error('Error updating user stats:', error);
    }
}

async function handleGreeting(sender_id, userName) {
    const appState = appStateManager.getAppState();
    return `
╭━━━━━━━━━━━━━━━━╮
│    𝗪𝗘𝗟𝗖𝗢𝗠𝗘    │
╰━━━━━━━━━━━━━━━━╯

${styleText('Hello')} ${styleText(userName, 'fancy1')}! 

${styleText('I am')} ${styleText(appState.botInfo.name, 'bold')}

${styleText('Created by:')}
${styleText(appState.botInfo.creator, 'fancy2')}

╭━━━━━━━━━━━━━━━━╮
│   𝗣𝗥𝗘𝗙𝗜𝗫: !   │
╰━━━━━━━━━━━━━━━━╯

${styleText('Type')} ${styleText('!help', 'bold')} ${styleText('for commands')}

━━━━━━━━━━━━━━━━━━`;
}

module.exports = { handleMessage };