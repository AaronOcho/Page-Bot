require('dotenv').config();

module.exports = {
    prefix: '!',
    adminIds: ['your_facebook_id'],
    pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL,
    apis: {
        chatgpt4: 'https://zen-api.up.railway.app/api/chatgpt4',
        trixie: 'http://87.106.100.187:6312/api/trixie',
        dalle3: 'http://87.106.100.187:6312/api/dalle-3',
        ba: 'https://zen-api.up.railway.app/api/ba',
        cdp: 'https://zen-api.up.railway.app/api/cdp',
        bible: 'https://zen-api.up.railway.app/api/bible',
        shoti: 'https://shoti.fbbot.org/api/get-shoti',
        shotiAlt: 'https://betadash-shoti-yazky.vercel.app/shotizxx',
        blackbox: 'https://betadash-api-swordslush-production.up.railway.app/blackbox-pro',
        gpt4: 'https://betadash-api-swordslush-production.up.railway.app/gpt4-omni',
        deepseek: 'https://betadash-api-swordslush-production.up.railway.app/Deepseek-V3',
        spotify: 'https://betadash-api-swordslush-production.up.railway.app/spt',
        flux: 'https://betadash-api-swordslush-production.up.railway.app/flux',
        fluxweb: 'https://betadash-api-swordslush-production.up.railway.app/fluxwebui',
        slap: 'https://betadash-api-swordslush-production.up.railway.app/slap',
        slapv2: 'https://betadash-api-swordslush-production.up.railway.app/slapv2',
        kiss: 'https://betadash-api-swordslush-production.up.railway.app/kiss',
        kiss2: 'https://betadash-api-swordslush-production.up.railway.app/kiss2',
        billboard: 'https://betadash-api-swordslush-production.up.railway.app/billboard',
        hangingBillboard: 'https://betadash-api-swordslush-production.up.railway.app/hanging-billboard'
    }
};