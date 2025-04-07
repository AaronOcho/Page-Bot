const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti, { responseType: 'json' });
            if (response.data && response.data.data && response.data.data.url) {
                return response.data.data.url;
            }

            const altResponse = await axios.get(config.apis.shotiAlt, { responseType: 'json' });
            return altResponse.data && altResponse.data.url ? altResponse.data.url : 'No video available.';
        } catch (error) {
            console.error('Shoti Error:', error);
            return 'Error fetching video. Please try again.';
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return 'Please provide a song title. Usage: !spotify <song title>';
        try {
            const response = await axios.get(`${config.apis.spotify}${encodeURIComponent(args.join(' '))}`, {
                responseType: 'json'
            });
            return response.data && response.data.url ? response.data.url : 'Song not found.';
        } catch (error) {
            console.error('Spotify Error:', error);
            return 'Error searching for song. Please try again.';
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return 'Please provide a prompt. Usage: !flux <your prompt>';
        try {
            const response = await axios.get(`${config.apis.flux}${encodeURIComponent(args.join(' '))}`, {
                responseType: 'json'
            });
            return response.data && response.data.url ? response.data.url : 'No image generated.';
        } catch (error) {
            console.error('Flux Error:', error);
            return 'Error generating image. Please try again.';
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return 'Please provide a prompt. Usage: !fluxweb <your prompt>';
        try {
            const response = await axios.get(`${config.apis.fluxweb}${encodeURIComponent(args.join(' '))}`, {
                responseType: 'json'
            });
            return response.data && response.data.url ? response.data.url : 'No image generated.';
        } catch (error) {
            console.error('FluxWeb Error:', error);
            return 'Error generating image. Please try again.';
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp, { responseType: 'json' });
            return response.data && response.data.url ? response.data.url : 'No image available.';
        } catch (error) {
            console.error('CDP Error:', error);
            return 'Error fetching image. Please try again.';
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba, { responseType: 'json' });
            return response.data && response.data.url ? response.data.url : 'No image available.';
        } catch (error) {
            console.error('BA Error:', error);
            return 'Error fetching image. Please try again.';
        }
    }
};