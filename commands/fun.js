const axios = require('axios');
const config = require('../config');

module.exports = {
    slap: async (sender_id, args) => {
        if (args.length < 2) return 'Please tag two users. Usage: !slap @user1 @user2';
        try {
            const response = await axios.post(config.apis.slap, {
                user1: args[0],
                user2: args[1]
            });
            return response.data.url || 'Failed to generate image.';
        } catch (error) {
            try {
                const altResponse = await axios.post(config.apis.slapv2, {
                    user1: args[0],
                    user2: args[1]
                });
                return altResponse.data.url || 'Failed to generate image.';
            } catch (error) {
                return 'Error generating slap image. Please try again.';
            }
        }
    },

    kiss: async (sender_id, args) => {
        if (args.length < 2) return 'Please tag two users. Usage: !kiss @user1 @user2';
        try {
            const response = await axios.post(config.apis.kiss, {
                user1: args[0],
                user2: args[1]
            });
            return response.data.url || 'Failed to generate image.';
        } catch (error) {
            try {
                const altResponse = await axios.post(config.apis.kiss2, {
                    user1: args[0],
                    user2: args[1]
                });
                return altResponse.data.url || 'Failed to generate image.';
            } catch (error) {
                return 'Error generating kiss image. Please try again.';
            }
        }
    },

    billboard: async (sender_id, args) => {
        if (!args.length) return 'Please provide text. Usage: !billboard <text>';
        try {
            const response = await axios.post(config.apis.billboard, {
                text: args.join(' ')
            });
            return response.data.url || 'Failed to generate image.';
        } catch (error) {
            return 'Error generating billboard image. Please try again.';
        }
    },

    hangingBillboard: async (sender_id, args) => {
        if (!args.length) return 'Please provide text. Usage: !hangingBillboard <text>';
        try {
            const response = await axios.post(config.apis.hangingBillboard, {
                text: args.join(' ')
            });
            return response.data.url || 'Failed to generate image.';
        } catch (error) {
            return 'Error generating hanging billboard image. Please try again.';
        }
    }
};