const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti);
            return response.data.url || 'No video available.';
        } catch (error) {
            try {
                const altResponse = await axios.get(config.apis.shotiAlt);
                return altResponse.data.url || 'No video available.';
            } catch (error) {
                return 'Error fetching video. Please try again.';
            }
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return 'Please provide a song title. Usage: !spotify <song title>';
        try {
            const response = await axios.post(config.apis.spotify, {
                title: args.join(' ')
            });
            return response.data.url || 'Song not found.';
        } catch (error) {
            return 'Error searching for song. Please try again.';
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return 'Please provide a prompt. Usage: !flux <your prompt>';
        try {
            const response = await axios.post(config.apis.flux, {
                prompt: args.join(' ')
            });
            return response.data.url || 'No image generated.';
        } catch (error) {
            return 'Error generating image. Please try again.';
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return 'Please provide a prompt. Usage: !fluxweb <your prompt>';
        try {
            const response = await axios.post(config.apis.fluxweb, {
                prompt: args.join(' ')
            });
            return response.data.url || 'No image generated.';
        } catch (error) {
            return 'Error generating image. Please try again.';
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp);
            return response.data.url || 'No image available.';
        } catch (error) {
            return 'Error fetching image. Please try again.';
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba);
            return response.data.url || 'No image available.';
        } catch (error) {
            return 'Error fetching image. Please try again.';
        }
    }
};