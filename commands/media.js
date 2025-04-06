const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti);
            if (response.data && response.data.image) return response.data.image;

            const altResponse = await axios.get(config.apis.shotiAlt);
            return altResponse.data && altResponse.data.image ? altResponse.data.image : 'No video available.';
        } catch (error) {
            return 'Error fetching video. Please try again.';
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return 'Please provide a song title. Usage: !spotify <song title>';
        try {
            const response = await axios.get(`${config.apis.spotify}${encodeURIComponent(args.join(' '))}`);
            return response.data && response.data.image ? response.data.image : 'Song not found.';
        } catch (error) {
            return 'Error searching for song. Please try again.';
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return 'Please provide a prompt. Usage: !flux <your prompt>';
        try {
            const response = await axios.get(`${config.apis.flux}${encodeURIComponent(args.join(' '))}`);
            return response.data && response.data.image ? response.data.image : 'No image generated.';
        } catch (error) {
            return 'Error generating image. Please try again.';
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return 'Please provide a prompt. Usage: !fluxweb <your prompt>';
        try {
            const response = await axios.get(`${config.apis.fluxweb}${encodeURIComponent(args.join(' '))}`);
            return response.data && response.data.image ? response.data.image : 'No image generated.';
        } catch (error) {
            return 'Error generating image. Please try again.';
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp);
            return response.data && response.data.image ? response.data.image : 'No image available.';
        } catch (error) {
            return 'Error fetching image. Please try again.';
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba);
            return response.data && response.data.image ? response.data.image : 'No image available.';
        } catch (error) {
            return 'Error fetching image. Please try again.';
        }
    }
};