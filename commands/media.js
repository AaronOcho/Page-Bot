const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            let response = await axios.get(config.apis.shoti);
            if (response.data && response.data.data) {
                return response.data.data;
            }
            
            response = await axios.get(config.apis.shotiAlt);
            if (response.data) {
                return response.data;
            }
            return 'No video available.';
        } catch (error) {
            return 'Error fetching video.';
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return 'Please provide a song title.';
        try {
            const response = await axios.get(`${config.apis.spotify}${encodeURIComponent(args.join(' '))}`);
            return response.data || 'Song not found.';
        } catch (error) {
            return 'Error searching song.';
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return 'Please provide a prompt.';
        try {
            const response = await axios.get(`${config.apis.flux}${encodeURIComponent(args.join(' '))}`);
            return response.data || 'No image generated.';
        } catch (error) {
            return 'Error generating image.';
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return 'Please provide a prompt.';
        try {
            const response = await axios.get(`${config.apis.fluxweb}${encodeURIComponent(args.join(' '))}`);
            return response.data || 'No image generated.';
        } catch (error) {
            return 'Error generating image.';
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp);
            return response.data || 'No image available.';
        } catch (error) {
            return 'Error fetching image.';
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba);
            return response.data || 'No image available.';
        } catch (error) {
            return 'Error fetching image.';
        }
    }
};