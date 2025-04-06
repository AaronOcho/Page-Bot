const axios = require('axios');
const config = require('../config/config');

module.exports = {
    slap: async (sender_id, args) => {
        if (args.length < 2) return 'Please tag two users. Usage: !slap @user1 @user2';
        try {
            const response = await axios.get(`${config.apis.slap}${encodeURIComponent(args[0])}&superman=${encodeURIComponent(args[1])}`);
            if (response.data && response.data.image) return response.data.image;

            const altResponse = await axios.get(`${config.apis.slapv2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
            return altResponse.data && altResponse.data.image ? altResponse.data.image : 'Failed to generate image.';
        } catch (error) {
            return 'Error generating slap image. Please try again.';
        }
    },

    kiss: async (sender_id, args) => {
        if (args.length < 2) return 'Please tag two users. Usage: !kiss @user1 @user2';
        try {
            const response = await axios.get(`${config.apis.kiss}${encodeURIComponent(args[0])}&userid2=${encodeURIComponent(args[1])}`);
            if (response.data && response.data.image) return response.data.image;

            const altResponse = await axios.get(`${config.apis.kiss2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
            return altResponse.data && altResponse.data.image ? altResponse.data.image : 'Failed to generate image.';
        } catch (error) {
            return 'Error generating kiss image. Please try again.';
        }
    },

    billboard: async (sender_id, args) => {
        if (!args.length) return 'Please provide text. Usage: !billboard <text>';
        try {
            const response = await axios.get(`${config.apis.billboard}${encodeURIComponent(args.join(' '))}`);
            return response.data && response.data.image ? response.data.image : 'Failed to generate image.';
        } catch (error) {
            return 'Error generating billboard image. Please try again.';
        }
    },

    hangingBillboard: async (sender_id, args) => {
        if (!args.length) return 'Please provide text. Usage: !hangingBillboard <text>';
        try {
            const response = await axios.get(`${config.apis.hangingBillboard}${sender_id}&text=${encodeURIComponent(args.join(' '))}`);
            return response.data && response.data.image ? response.data.image : 'Failed to generate image.';
        } catch (error) {
            return 'Error generating hanging billboard image. Please try again.';
        }
    }
};