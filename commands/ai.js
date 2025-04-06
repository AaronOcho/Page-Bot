const axios = require('axios');
const config = require('../../config/config');

module.exports = {
    chatgpt: async (sender_id, args) => {
        if (!args.length) return 'Please provide a message. Usage: !chatgpt <your message>';
        try {
            const response = await axios.get(`${config.apis.chatgpt4}${encodeURIComponent(args.join(' '))}`);
            return response.data.response || 'No response received.';
        } catch (error) {
            console.error('ChatGPT API Error:', error);
            return 'Error connecting to ChatGPT. Please try again.';
        }
    },

    trixie: async (sender_id, args) => {
        if (!args.length) return 'Please provide a message. Usage: !trixie <your message>';
        try {
            const response = await axios.get(`${config.apis.trixie}${encodeURIComponent(args.join(' '))}`);
            return response.data.response || 'No response received.';
        } catch (error) {
            return 'Error connecting to Trixie. Please try again.';
        }
    },

    dalle: async (sender_id, args) => {
        if (!args.length) return 'Please provide a prompt. Usage: !dalle <your prompt>';
        try {
            const response = await axios.get(`${config.apis.dalle3}${encodeURIComponent(args.join(' '))}`);
            return response.data.url || 'No image generated.';
        } catch (error) {
            return 'Error generating image. Please try again.';
        }
    },

    blackbox: async (sender_id, args) => {
        if (!args.length) return 'Please provide a message. Usage: !blackbox <your message>';
        try {
            const response = await axios.get(`${config.apis.blackbox}${encodeURIComponent(args.join(' '))}`);
            return response.data.response || 'No response received.';
        } catch (error) {
            return 'Error connecting to Blackbox. Please try again.';
        }
    },

    gpt4: async (sender_id, args) => {
        if (!args.length) return 'Please provide a message. Usage: !gpt4 <your message>';
        try {
            const response = await axios.get(`${config.apis.gpt4}${encodeURIComponent(args.join(' '))}&userid=${sender_id}`);
            return response.data.response || 'No response received.';
        } catch (error) {
            return 'Error connecting to GPT-4. Please try again.';
        }
    },

    deepseek: async (sender_id, args) => {
        if (!args.length) return 'Please provide a message. Usage: !deepseek <your message>';
        try {
            const response = await axios.get(`${config.apis.deepseek}${encodeURIComponent(args.join(' '))}`);
            return response.data.response || 'No response received.';
        } catch (error) {
            return 'Error connecting to Deepseek. Please try again.';
        }
    }
};