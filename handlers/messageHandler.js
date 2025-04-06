const { styleText } = require('../utils/fonts');
const appStateManager = require('../utils/appStateManager');
const { pool } = require('../utils/database');
const commandHandler = require('./commandHandler');

async function handleMessage(sender_id, message, userName) {
    console.log(`Processing message from ${userName} (${sender_id}): ${message}`);

    if (!message) {
        console.log('Empty message received');
        return "I couldn't understand that message.";
    }

    const appState = appStateManager.getAppState();

    if (appState.botInfo.settings.maintenance && !appState.botInfo.admins.includes(sender_id)) {
        return "⚠️ Bot is currently under maintenance";
    }

    try {
        const isBanned = await pool.query('SELECT is_banned FROM users WHERE user_id = $1', [sender_id]);
        if (isBanned.rows[0]?.is_banned) {
            return "⚠️ You are banned from using this bot";
        }

        await updateUserStats(sender_id);

        const lowercaseMsg = message.toLowerCase();
        if (lowercaseMsg === 'hi' || lowercaseMsg === 'hello') {
            console.log('Handling greeting');
            return await handleGreeting(sender_id, userName);
        }

        if (message.startsWith(appState.botInfo.prefix)) {
            console.log('Handling command');
            const args = message.slice(appState.botInfo.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            await pool.query(
                'UPDATE users SET command_count = command_count + 1 WHERE user_id = $1',
                [sender_id]
            );

            return await commandHandler.execute(command, sender_id, args);
        }

        return `Hello ${userName}! To see available commands, type !help`;

    } catch (error) {
        console.error('Error in handleMessage:', error);
        return "An error occurred while processing your message. Please try again.";
    }
}

async function updateUserStats(userId) {
    try {
        await pool.query(
            'UPDATE users SET message_count = message_count + 1 WHERE user_id = $1',
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
│    ${styleText('WELCOME')}    │
╰━━━━━━━━━━━━━━━━╯

${styleText('Hello')} ${styleText(userName)}! 

${styleText('I am')} ${styleText(appState.botInfo.name)}

${styleText('Created by:')}
${styleText(appState.botInfo.creator)}

╭━━━━━━━━━━━━━━━━╮
│   ${styleText(`PREFIX: ${appState.botInfo.prefix}`)}   │
╰━━━━━━━━━━━━━━━━╯

${styleText('Type')} ${styleText(`${appState.botInfo.prefix}help`)} ${styleText('for commands')}

━━━━━━━━━━━━━━━━━━`;
}

module.exports = { handleMessage };