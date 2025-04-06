const axios = require('axios');
const config = require('../config/config');

module.exports = {
    slap: async (args) => {
        try {
            const [user1, user2] = args;
            const response = await axios.get(`${config.apis.slap}?batman=${user1}&superman=${user2}`);
            return response.data;
        } catch (error) {
            return "Error generating slap image.";
        }
    },

    slapv2: async (args) => {
        try {
            const [user1, user2] = args;
            const response = await axios.get(`${config.apis.slapv2}?one=${user1}&two=${user2}`);
            return response.data;
        } catch (error) {
            return "Error generating slap image.";
        }
    },

    kiss: async (args) => {
        try {
            const [user1, user2] = args;
            const response = await axios.get(`${config.apis.kiss}?userid1=${user1}&userid2=${user2}`);
            return response.data;
        } catch (error) {
            return "Error generating kiss image.";
        }
    },

    kiss2: async (args) => {
        try {
            const [user1, user2] = args;
            const response = await axios.get(`${config.apis.kiss2}?one=${user1}&two=${user2}`);
            return response.data;
        } catch (error) {
            return "Error generating kiss image.";
        }
    },

    billboard: async (args) => {
        try {
            const response = await axios.get(`${config.apis.billboard}?text=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error generating billboard image.";
        }
    },

    hangingBillboard: async (args, userId) => {
        try {
            const text = args.join(' ');
            const response = await axios.get(`${config.apis.hangingBillboard}?userid=${userId}&text=${encodeURIComponent(text)}`);
            return response.data;
        } catch (error) {
            return "Error generating hanging billboard image.";
        }
    }
};