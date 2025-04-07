const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti);
            return response.data?.data?.url || response.data?.url || 'No video available';
        } catch {
            try {
                const altResponse = await axios.get(config.apis.shotiAlt);
                return altResponse.data?.url || 'No video available';
            } catch {
                return 'Error fetching video';
            }
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return 'Usage: !spotify <song>';
        try {
            const response = await axios.get(`${config.apis.spotify}${encodeURIComponent(args.join(' '))}`);
            return response.data?.url || 'Song not found';
        } catch {
            return 'Error searching song';
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return 'Usage: !flux <prompt>';
        try {
            const response = await axios.get(`${config.apis.flux}${encodeURIComponent(args.join(' '))}`);
            return response.data?.url || 'Failed to generate image';
        } catch {
            return 'Error generating image';
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return 'Usage: !fluxweb <prompt>';
        try {
            const response = await axios.get(`${config.apis.fluxweb}${encodeURIComponent(args.join(' '))}`);
            return response.data?.url || 'Failed to generate image';
        } catch {
            return 'Error generating image';
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp);
            return response.data?.url || 'No image available';
        } catch {
            return 'Error fetching image';
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba);
            return response.data?.url || 'No image available';
        } catch {
            return 'Error fetching image';
        }
    }
};