const axios = require('axios');
const FormData = require('form-data');
const config = require('../config/config');

async function uploadAttachment(buffer, type) {
    const formData = new FormData();
    formData.append('message', JSON.stringify({
        attachment: {
            type: type,
            payload: {
                is_reusable: true
            }
        }
    }));
    formData.append('filedata', buffer, { 
        filename: `media.${type === 'image' ? 'png' : type === 'video' ? 'mp4' : 'mp3'}`,
        contentType: type === 'image' ? 'image/png' : type === 'video' ? 'video/mp4' : 'audio/mpeg'
    });

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/me/message_attachments?access_token=${config.pageAccessToken}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (response.data && response.data.attachment_id) {
            return response.data.attachment_id;
        } else {
            console.error('Upload response:', response.data);
            throw new Error('No attachment ID received');
        }
    } catch (error) {
        console.error('Upload error:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti, {
                responseType: 'arraybuffer'
            });
            const attachmentId = await uploadAttachment(response.data, 'video');
            return {
                attachment: {
                    type: 'video',
                    payload: {
                        attachment_id: attachmentId
                    }
                }
            };
        } catch (error) {
            try {
                const altResponse = await axios.get(config.apis.shotiAlt, {
                    responseType: 'arraybuffer'
                });
                const attachmentId = await uploadAttachment(altResponse.data, 'video');
                return {
                    attachment: {
                        type: 'video',
                        payload: {
                            attachment_id: attachmentId
                        }
                    }
                };
            } catch (altError) {
                console.error('Shoti Error:', error, 'Alt Error:', altError);
                return { text: 'Error fetching video' };
            }
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return { text: 'Usage: !spotify <song>' };
        try {
            const response = await axios.get(`${config.apis.spotify}${encodeURIComponent(args.join(' '))}`, {
                responseType: 'arraybuffer'
            });
            const attachmentId = await uploadAttachment(response.data, 'audio');
            return {
                attachment: {
                    type: 'audio',
                    payload: {
                        attachment_id: attachmentId
                    }
                }
            };
        } catch (error) {
            console.error('Spotify Error:', error);
            return { text: 'Error searching song' };
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return { text: 'Usage: !flux <prompt>' };
        try {
            const response = await axios.get(`${config.apis.flux}${encodeURIComponent(args.join(' '))}`, {
                responseType: 'arraybuffer'
            });
            const attachmentId = await uploadAttachment(response.data, 'image');
            return {
                attachment: {
                    type: 'image',
                    payload: {
                        attachment_id: attachmentId
                    }
                }
            };
        } catch (error) {
            console.error('Flux Error:', error);
            return { text: 'Error generating image' };
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return { text: 'Usage: !fluxweb <prompt>' };
        try {
            const response = await axios.get(`${config.apis.fluxweb}${encodeURIComponent(args.join(' '))}`, {
                responseType: 'arraybuffer'
            });
            const attachmentId = await uploadAttachment(response.data, 'image');
            return {
                attachment: {
                    type: 'image',
                    payload: {
                        attachment_id: attachmentId
                    }
                }
            };
        } catch (error) {
            console.error('FluxWeb Error:', error);
            return { text: 'Error generating image' };
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp, {
                responseType: 'arraybuffer'
            });
            const attachmentId = await uploadAttachment(response.data, 'image');
            return {
                attachment: {
                    type: 'image',
                    payload: {
                        attachment_id: attachmentId
                    }
                }
            };
        } catch (error) {
            console.error('CDP Error:', error);
            return { text: 'Error fetching image' };
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba, {
                responseType: 'arraybuffer'
            });
            const attachmentId = await uploadAttachment(response.data, 'image');
            return {
                attachment: {
                    type: 'image',
                    payload: {
                        attachment_id: attachmentId
                    }
                }
            };
        } catch (error) {
            console.error('BA Error:', error);
            return { text: 'Error fetching image' };
        }
    }
};