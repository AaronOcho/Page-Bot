const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti);
            return response.data;
        } catch (error) {
            return "Error fetching shoti.";
        }
    },

    spotify: async (args) => {
        try {
            const response = await axios.get(`${config.apis.spotify}?title=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error fetching spotify data.";
        }
    },

    flux: async (args) => {
        try {
            const response = await axios.get(`${config.apis.flux}?prompt=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error generating image.";
        }
    },

    fluxweb: async (args) => {
        try {
            const response = await axios.get(`${config.apis.fluxweb}?prompt=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error generating image.";
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp);
            return response.data;
        } catch (error) {
            return "Error fetching CDP.";
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba);
            return response.data;
        } catch (error) {
            return "Error fetching BA.";
        }
    }
};