const axios = require('axios');
const config = require('../config/config');

module.exports = {
    slap: async (sender_id, args) => {
        if (args.length < 2) return { text: 'Tag 2 users' };
        try {
            const response = await axios.get(`${config.apis.slap}${encodeURIComponent(args[0])}&superman=${encodeURIComponent(args[1])}`);
            const imageUrl = response.data?.url;
            if (imageUrl) return { attachment: { type: 'image', payload: { url: imageUrl } } };
            
            const altResponse = await axios.get(`${config.apis.slapv2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
            const altImageUrl = altResponse.data?.url;
            if (altImageUrl) return { attachment: { type: 'image', payload: { url: altImageUrl } } };
            
            return { text: 'Failed to generate image' };
        } catch {
            return { text: 'Error' };
        }
    },

    kiss: async (sender_id, args) => {
        if (args.length < 2) return { text: 'Tag 2 users' };
        try {
            const response = await axios.get(`${config.apis.kiss}${encodeURIComponent(args[0])}&userid2=${encodeURIComponent(args[1])}`);
            const imageUrl = response.data?.url;
            if (imageUrl) return { attachment: { type: 'image', payload: { url: imageUrl } } };
            
            const altResponse = await axios.get(`${config.apis.kiss2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
            const altImageUrl = altResponse.data?.url;
            if (altImageUrl) return { attachment: { type: 'image', payload: { url: altImageUrl } } };
            
            return { text: 'Failed to generate image' };
        } catch {
            return { text: 'Error' };
        }
    },

    billboard: async (sender_id, args) => {
        if (!args.length) return { text: 'Add text' };
        try {
            const response = await axios.get(`${config.apis.billboard}${encodeURIComponent(args.join(' '))}`);
            const imageUrl = response.data?.url;
            if (imageUrl) return { attachment: { type: 'image', payload: { url: imageUrl } } };
            return { text: 'Failed to generate image' };
        } catch {
            return { text: 'Error' };
        }
    },

    hangingBillboard: async (sender_id, args) => {
        if (!args.length) return { text: 'Add text' };
        try {
            const response = await axios.get(`${config.apis.hangingBillboard}${sender_id}&text=${encodeURIComponent(args.join(' '))}`);
            const imageUrl = response.data?.url;
            if (imageUrl) return { attachment: { type: 'image', payload: { url: imageUrl } } };
            return { text: 'Failed to generate image' };
        } catch {
            return { text: 'Error' };
        }
    }
};