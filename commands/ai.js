const axios = require('axios');
const config = require('../config/config');

module.exports = {
    chatgpt: async (args, userId) => {
        try {
            const response = await axios.get(`${config.apis.chatgpt4}?prompt=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error processing request.";
        }
    },

    trixie: async (args) => {
        try {
            const response = await axios.get(`${config.apis.trixie}?prompt=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error processing request.";
        }
    },

    dalle: async (args) => {
        try {
            const response = await axios.get(`${config.apis.dalle3}?prompt=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error generating image.";
        }
    },

    blackbox: async (args) => {
        try {
            const response = await axios.get(`${config.apis.blackbox}?ask=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error processing request.";
        }
    },

    gpt4: async (args, userId) => {
        try {
            const response = await axios.get(`${config.apis.gpt4}?ask=${encodeURIComponent(args.join(' '))}&userid=${userId}`);
            return response.data;
        } catch (error) {
            return "Error processing request.";
        }
    },

    deepseek: async (args) => {
        try {
            const response = await axios.get(`${config.apis.deepseek}?ask=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error processing request.";
        }
    },

    bible: async (args) => {
        try {
            const response = await axios.get(`${config.apis.bible}?verse=${encodeURIComponent(args.join(' '))}`);
            return response.data;
        } catch (error) {
            return "Error fetching bible verse.";
        }
    }
};