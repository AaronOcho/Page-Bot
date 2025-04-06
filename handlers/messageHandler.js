const { styleText } = require('../utils/fonts');
const appStateManager = require('../utils/appStateManager');
const { pool } = require('../utils/database');
const commandHandler = require('./commandHandler');

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
│   𝗣𝗥𝗘𝗙𝗜𝗫: ${appState.botInfo.prefix}   │
╰━━━━━━━━━━━━━━━━╯

${styleText('Type')} ${styleText(`${appState.botInfo.prefix}help`, 'bold')} ${styleText('for commands')}

━━━━━━━━━━━━━━━━━━`;
}

async function updateUserStats(userId) {
    await pool.query(
        'UPDATE users SET message_count = message_count + 1 WHERE user_id = $1',
        [userId]
    );
}

async function handleMessage(sender_id, message, userName) {
    const appState = appStateManager.getAppState();
    
    if (appState.botInfo.settings.maintenance && !appState.botInfo.admins.includes(sender_id)) {
        return "⚠️ Bot is currently under maintenance";
    }

    const isBanned = await pool.query('SELECT is_banned FROM users WHERE user_id = $1', [sender_id]);
    if (isBanned.rows[0]?.is_banned) {
        return "⚠️ You are banned from using this bot";
    }

    await updateUserStats(sender_id);

    const lowercaseMsg = message.toLowerCase();
    if (lowercaseMsg === 'hi' || lowercaseMsg === 'hello') {
        return await handleGreeting(sender_id, userName);
    }

    if (message.startsWith(appState.botInfo.prefix)) {
        const args = message.slice(appState.botInfo.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        await pool.query(
            'UPDATE users SET command_count = command_count + 1 WHERE user_id = $1',
            [sender_id]
        );
        return await commandHandler.execute(command, sender_id, args);
    }

    return await handleNormalMessage(message);
}

module.exports = { handleMessage };