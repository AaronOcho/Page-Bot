const fs = require('fs');
const path = require('path');

class AppStateManager {
    constructor() {
        this.appStatePath = path.join(__dirname, '../appState.json');
        this.loadAppState();
    }

    loadAppState() {
        try {
            this.appState = JSON.parse(fs.readFileSync(this.appStatePath, 'utf8'));
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
                    admins: [],
                    settings: {
                        autoReact: true,
                        autoReply: true,
                        maintenance: false
                    }
                }
            };
            this.saveAppState();
        }
    }

    getAppState() {
        return this.appState;
    }

    updateAppState(newState) {
        this.appState = { ...this.appState, ...newState };
        this.saveAppState();
    }

    saveAppState() {
        fs.writeFileSync(this.appStatePath, JSON.stringify(this.appState, null, 2));
    }

    updateCookies(cookies) {
        this.appState.cookies = cookies;
        this.saveAppState();
    }

    updateAccessToken(token) {
        this.appState.accessToken = token;
        this.saveAppState();
    }
}

module.exports = new AppStateManager();