const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti);
            console.log('Shoti API Response:', JSON.stringify(response.data, null, 2));
            return response.data?.data?.url || response.data?.url || 'No video available';
        } catch (error) {
            try {
                const altResponse = await axios.get(config.apis.shotiAlt);
                console.log('Shoti Alt API Response:', JSON.stringify(altResponse.data, null, 2));
                return altResponse.data?.url || 'No video available';
            } catch (altError) {
                console.log('Shoti Error:', error.response?.data || error.message);
                console.log('Shoti Alt Error:', altError.response?.data || altError.message);
                return 'Error fetching video';
            }
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return 'Usage: !spotify <song>';
        try {
            const response = await axios.get(`${config.apis.spotify}${encodeURIComponent(args.join(' '))}`);
            console.log('Spotify API Response:', JSON.stringify(response.data, null, 2));
            return response.data?.url || 'Song not found';
        } catch (error) {
            console.log('Spotify Error:', error.response?.data || error.message);
            return 'Error searching song';
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return 'Usage: !flux <prompt>';
        try {
            const response = await axios.get(`${config.apis.flux}${encodeURIComponent(args.join(' '))}`);
            console.log('Flux API Response:', JSON.stringify(response.data, null, 2));
            return response.data?.url || 'Failed to generate image';
        } catch (error) {
            console.log('Flux Error:', error.response?.data || error.message);
            return 'Error generating image';
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return 'Usage: !fluxweb <prompt>';
        try {
            const response = await axios.get(`${config.apis.fluxweb}${encodeURIComponent(args.join(' '))}`);
            console.log('FluxWeb API Response:', JSON.stringify(response.data, null, 2));
            return response.data?.url || 'Failed to generate image';
        } catch (error) {
            console.log('FluxWeb Error:', error.response?.data || error.message);
            return 'Error generating image';
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp);
            console.log('CDP API Response:', JSON.stringify(response.data, null, 2));
            return response.data?.url || 'No image available';
        } catch (error) {
            console.log('CDP Error:', error.response?.data || error.message);
            return 'Error fetching image';
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba);
            console.log('BA API Response:', JSON.stringify(response.data, null, 2));
            return response.data?.url || 'No image available';
        } catch (error) {
            console.log('BA Error:', error.response?.data || error.message);
            return 'Error fetching image';
        }
    }
};