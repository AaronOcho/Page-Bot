const fs = require('fs');
const path = require('path');
const axios = require('axios');

class AppStateManager {
    constructor() {
        this.appStatePath = path.join(__dirname, '../appState.json');
        this.loadAppState();
        this.initializeTokenCheck();
    }

    loadAppState() {
        try {
            this.appState = JSON.parse(fs.readFileSync(this.appStatePath, 'utf8'));
            this.validateToken();
        } catch (error) {
            this.appState = {
                url: "https://www.facebook.com",
                cookies: [],
                accessToken: process.env.PAGE_ACCESS_TOKEN,
                botInfo: {
                    name: "𝗟𝗢𝗥𝗗 • 𝗕𝗢𝗧",
                    creator: "𝗔𝗔𝗥𝗢𝗡 𝗢𝗖𝗛𝗢𝗔 / 𝗛𝗘𝗟𝗧𝗢𝗡 𝗡𝗜𝗚𝗛𝗧𝗦𝗛𝗔𝗗𝗘",
                    prefix: "!",
                    version: "1.0.0",
                    admins: ["100091575503341"],
                    blacklistedUsers: [],
                    settings: {
                        autoReact: true,
                        autoReply: true,
                        maintenance: false,
                        notifyAdmins: true
                    }
                },
                stats: {
                    messagesProcessed: 0,
                    commandsExecuted: 0,
                    lastRestart: new Date().toISOString()
                }
            };
            this.saveAppState();
        }
    }

    async validateToken() {
        try {
            const response = await axios.get('https://graph.facebook.com/v18.0/me', {
                params: {
                    access_token: this.appState.accessToken || process.env.PAGE_ACCESS_TOKEN
                }
            });
            if (response.data.id) {
                this.appState.pageId = response.data.id;
                this.saveAppState();
            }
        } catch (error) {
            console.error('Token validation error:', error.response?.data || error.message);
        }
    }

    initializeTokenCheck() {
        setInterval(() => this.validateToken(), 6 * 60 * 60 * 1000);
    }

    getAppState() {
        return this.appState;
    }

    updateAppState(newState) {
        this.appState = { ...this.appState, ...newState };
        this.saveAppState();
    }

    saveAppState() {
        try {
            fs.writeFileSync(this.appStatePath, JSON.stringify(this.appState, null, 2));
        } catch (error) {
            console.error('Error saving app state:', error);
        }
    }

    updateCookies(cookies) {
        this.appState.cookies = cookies;
        this.saveAppState();
    }

    updateAccessToken(token) {
        this.appState.accessToken = token;
        this.saveAppState();
        this.validateToken();
    }

    incrementStat(stat) {
        if (this.appState.stats[stat] !== undefined) {
            this.appState.stats[stat]++;
            this.saveAppState();
        }
    }

    getStats() {
        return this.appState.stats;
    }

    isAdmin(userId) {
        return this.appState.botInfo.admins.includes(userId);
    }

    isBlacklisted(userId) {
        return this.appState.botInfo.blacklistedUsers.includes(userId);
    }

    getSetting(setting) {
        return this.appState.botInfo.settings[setting];
    }

    updateSetting(setting, value) {
        this.appState.botInfo.settings[setting] = value;
        this.saveAppState();
    }
}

module.exports = new AppStateManager();