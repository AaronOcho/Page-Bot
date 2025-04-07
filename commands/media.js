const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti);
            const videoUrl = response.data?.data?.url || response.data?.url;
            if (videoUrl) return { attachment: { type: 'video', payload: { url: videoUrl } } };
        } catch {
            try {
                const altResponse = await axios.get(config.apis.shotiAlt);
                const videoUrl = altResponse.data?.url;
                if (videoUrl) return { attachment: { type: 'video', payload: { url: videoUrl } } };
            } catch {
                return { text: 'Error' };
            }
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return { text: 'Usage: !spotify <song>' };
        try {
            const response = await axios.get(`${config.apis.spotify}${encodeURIComponent(args.join(' '))}`);
            const audioUrl = response.data?.url;
            if (audioUrl) return { attachment: { type: 'audio', payload: { url: audioUrl } } };
            return { text: 'Song not found' };
        } catch {
            return { text: 'Error' };
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return { text: 'Usage: !flux <prompt>' };
        try {
            const response = await axios.get(`${config.apis.flux}${encodeURIComponent(args.join(' '))}`);
            const imageUrl = response.data?.url;
            if (imageUrl) return { attachment: { type: 'image', payload: { url: imageUrl } } };
            return { text: 'Failed to generate image' };
        } catch {
            return { text: 'Error' };
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return { text: 'Usage: !fluxweb <prompt>' };
        try {
            const response = await axios.get(`${config.apis.fluxweb}${encodeURIComponent(args.join(' '))}`);
            const imageUrl = response.data?.url;
            if (imageUrl) return { attachment: { type: 'image', payload: { url: imageUrl } } };
            return { text: 'Failed to generate image' };
        } catch {
            return { text: 'Error' };
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp);
            const imageUrl = response.data?.url;
            if (imageUrl) return { attachment: { type: 'image', payload: { url: imageUrl } } };
            return { text: 'No image available' };
        } catch {
            return { text: 'Error' };
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba);
            const imageUrl = response.data?.url;
            if (imageUrl) return { attachment: { type: 'image', payload: { url: imageUrl } } };
            return { text: 'No image available' };
        } catch {
            return { text: 'Error' };
        }
    }
};