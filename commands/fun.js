const axios = require('axios');
const config = require('../config/config');

module.exports = {
    slap: async (sender_id, args) => {
        if (args.length < 2) return 'Tag 2 users';
        try {
            const response = await axios.get(`${config.apis.slap}${encodeURIComponent(args[0])}&superman=${encodeURIComponent(args[1])}`);
            return response.data;
        } catch {
            try {
                const altResponse = await axios.get(`${config.apis.slapv2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
                return altResponse.data;
            } catch {
                return 'Error';
            }
        }
    },

    kiss: async (sender_id, args) => {
        if (args.length < 2) return 'Tag 2 users';
        try {
            const response = await axios.get(`${config.apis.kiss}${encodeURIComponent(args[0])}&userid2=${encodeURIComponent(args[1])}`);
            return response.data;
        } catch {
            try {
                const altResponse = await axios.get(`${config.apis.kiss2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
                return altResponse.data;
            } catch {
                return 'Error';
            }
        }
    },

    billboard: async (sender_id, args) => {
        if (!args.length) return 'Add text';
        try {
            const response = await axios.get(`${config.apis.billboard}${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch {
            return 'Error';
        }
    },

    hangingBillboard: async (sender_id, args) => {
        if (!args.length) return 'Add text';
        try {
            const response = await axios.get(`${config.apis.hangingBillboard}${sender_id}&text=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch {
            return 'Error';
        }
    }
};