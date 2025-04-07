const axios = require('axios');
const config = require('../config/config');

module.exports = {
    slap: async (sender_id, args) => {
        if (args.length < 2) return 'Tag 2 users.';
        try {
            let response = await axios.get(`${config.apis.slap}${encodeURIComponent(args[0])}&superman=${encodeURIComponent(args[1])}`);
            if (response.data) return response.data;

            response = await axios.get(`${config.apis.slapv2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
            return response.data || 'Failed to generate image.';
        } catch (error) {
            return 'Error generating image.';
        }
    },

    kiss: async (sender_id, args) => {
        if (args.length < 2) return 'Tag 2 users.';
        try {
            let response = await axios.get(`${config.apis.kiss}${encodeURIComponent(args[0])}&userid2=${encodeURIComponent(args[1])}`);
            if (response.data) return response.data;

            response = await axios.get(`${config.apis.kiss2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
            return response.data || 'Failed to generate image.';
        } catch (error) {
            return 'Error generating image.';
        }
    },

    billboard: async (sender_id, args) => {
        if (!args.length) return 'Provide text.';
        try {
            const response = await axios.get(`${config.apis.billboard}${encodeURIComponent(args.join(' '))}`);
            return response.data || 'Failed to generate image.';
        } catch (error) {
            return 'Error generating image.';
        }
    },

    hangingBillboard: async (sender_id, args) => {
        if (!args.length) return 'Provide text.';
        try {
            const response = await axios.get(`${config.apis.hangingBillboard}${sender_id}&text=${encodeURIComponent(args.join(' '))}`);
            return response.data || 'Failed to generate image.';
        } catch (error) {
            return 'Error generating image.';
        }
    }
};