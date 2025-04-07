const axios = require('axios');
const config = require('../config/config');

module.exports = {
    slap: async (sender_id, args) => {
        if (args.length < 2) return 'Tag 2 users';
        try {
            const response = await axios.get(`${config.apis.slap}${encodeURIComponent(args[0])}&superman=${encodeURIComponent(args[1])}`);
            console.log('Slap API Response:', JSON.stringify(response.data, null, 2));
            if (response.data?.url) return response.data.url;
            
            const altResponse = await axios.get(`${config.apis.slapv2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
            console.log('Slap Alt API Response:', JSON.stringify(altResponse.data, null, 2));
            return altResponse.data?.url || 'Failed to generate image';
        } catch (error) {
            console.log('Slap Error:', error.response?.data || error.message);
            return 'Error generating image';
        }
    },

    kiss: async (sender_id, args) => {
        if (args.length < 2) return 'Tag 2 users';
        try {
            const response = await axios.get(`${config.apis.kiss}${encodeURIComponent(args[0])}&userid2=${encodeURIComponent(args[1])}`);
            console.log('Kiss API Response:', JSON.stringify(response.data, null, 2));
            if (response.data?.url) return response.data.url;
            
            const altResponse = await axios.get(`${config.apis.kiss2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`);
            console.log('Kiss Alt API Response:', JSON.stringify(altResponse.data, null, 2));
            return altResponse.data?.url || 'Failed to generate image';
        } catch (error) {
            console.log('Kiss Error:', error.response?.data || error.message);
            return 'Error generating image';
        }
    },

    billboard: async (sender_id, args) => {
        if (!args.length) return 'Add text';
        try {
            console.log('Billboard Request URL:', `${config.apis.billboard}${encodeURIComponent(args.join(' '))}`);
            const response = await axios.get(`${config.apis.billboard}${encodeURIComponent(args.join(' '))}`);
            console.log('Billboard API Response:', JSON.stringify(response.data, null, 2));
            return response.data?.url || 'Failed to generate image';
        } catch (error) {
            console.log('Billboard Error:', error.response?.data || error.message);
            return 'Error generating image';
        }
    },

    hangingBillboard: async (sender_id, args) => {
        if (!args.length) return 'Add text';
        try {
            console.log('Hanging Billboard Request URL:', `${config.apis.hangingBillboard}${sender_id}&text=${encodeURIComponent(args.join(' '))}`);
            const response = await axios.get(`${config.apis.hangingBillboard}${sender_id}&text=${encodeURIComponent(args.join(' '))}`);
            console.log('Hanging Billboard API Response:', JSON.stringify(response.data, null, 2));
            return response.data?.url || 'Failed to generate image';
        } catch (error) {
            console.log('Hanging Billboard Error:', error.response?.data || error.message);
            return 'Error generating image';
        }
    }
};