require('dotenv').config();

module.exports = {
    prefix: '!',
    adminIds: ['100091575503341'],
    pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL,
    apis: {
        chatgpt4: 'https://zen-api.up.railway.app/api/chatgpt4?prompt=',
        trixie: 'http://87.106.100.187:6312/api/trixie?prompt=',
        dalle3: 'http://87.106.100.187:6312/api/dalle-3?prompt=',
        ba: 'https://zen-api.up.railway.app/api/ba',
        cdp: 'https://zen-api.up.railway.app/api/cdp',
        bible: 'https://zen-api.up.railway.app/api/bible',
        shoti: 'https://shoti.fbbot.org/api/get-shoti',
        shotiAlt: 'https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu',
        blackbox: 'https://betadash-api-swordslush-production.up.railway.app/blackbox-pro?ask=',
        gpt4: 'https://betadash-api-swordslush-production.up.railway.app/gpt4-omni?ask=',
        deepseek: 'https://betadash-api-swordslush-production.up.railway.app/Deepseek-V3?ask=',
        spotify: 'https://betadash-api-swordslush-production.up.railway.app/spt?title=',
        flux: 'https://betadash-api-swordslush-production.up.railway.app/flux?prompt=',
        fluxweb: 'https://betadash-api-swordslush-production.up.railway.app/fluxwebui?prompt=',
        slap: 'https://betadash-api-swordslush-production.up.railway.app/slap?batman=',
        slapv2: 'https://betadash-api-swordslush-production.up.railway.app/slapv2?one=',
        kiss: 'https://betadash-api-swordslush-production.up.railway.app/kiss?userid1=',
        kiss2: 'https://betadash-api-swordslush-production.up.railway.app/kiss2?one=',
        billboard: 'https://betadash-api-swordslush-production.up.railway.app/billboard?text=',
        hangingBillboard: 'https://betadash-api-swordslush-production.up.railway.app/hanging-billboard?userid='
    }
};