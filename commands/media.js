const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti, { responseType: 'arraybuffer' });
            return {
                body: response.data,
                type: 'video'
            };
        } catch {
            try {
                const altResponse = await axios.get(config.apis.shotiAlt, { responseType: 'arraybuffer' });
                return {
                    body: altResponse.data,
                    type: 'video'
                };
            } catch {
                return 'Error';
            }
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return 'Usage: !spotify <song>';
        try {
            const response = await axios.get(`${config.apis.spotify}${encodeURIComponent(args.join(' '))}`, { responseType: 'arraybuffer' });
            return {
                body: response.data,
                type: 'audio'
            };
        } catch {
            return 'Error';
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return 'Usage: !flux <prompt>';
        try {
            const response = await axios.get(`${config.apis.flux}${encodeURIComponent(args.join(' '))}`, { responseType: 'arraybuffer' });
            return {
                body: response.data,
                type: 'image'
            };
        } catch {
            return 'Error';
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return 'Usage: !fluxweb <prompt>';
        try {
            const response = await axios.get(`${config.apis.fluxweb}${encodeURIComponent(args.join(' '))}`, { responseType: 'arraybuffer' });
            return {
                body: response.data,
                type: 'image'
            };
        } catch {
            return 'Error';
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp, { responseType: 'arraybuffer' });
            return {
                body: response.data,
                type: 'image'
            };
        } catch {
            return 'Error';
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba, { responseType: 'arraybuffer' });
            return {
                body: response.data,
                type: 'image'
            };
        } catch {
            return 'Error';
        }
    }
};