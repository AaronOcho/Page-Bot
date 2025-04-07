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
    slap: async (sender_id, args) => {
        if (args.length < 2) return { text: 'Tag 2 users' };
        try {
            const response = await axios.get(`${config.apis.slap}${encodeURIComponent(args[0])}&superman=${encodeURIComponent(args[1])}`, {
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
            try {
                const altResponse = await axios.get(`${config.apis.slapv2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`, {
                    responseType: 'arraybuffer'
                });
                const attachmentId = await uploadAttachment(altResponse.data, 'image');
                return {
                    attachment: {
                        type: 'image',
                        payload: {
                            attachment_id: attachmentId
                        }
                    }
                };
            } catch (altError) {
                console.error('Slap Error:', error, 'Alt Error:', altError);
                return { text: 'Error generating image' };
            }
        }
    },

    kiss: async (sender_id, args) => {
        if (args.length < 2) return { text: 'Tag 2 users' };
        try {
            const response = await axios.get(`${config.apis.kiss}${encodeURIComponent(args[0])}&userid2=${encodeURIComponent(args[1])}`, {
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
            try {
                const altResponse = await axios.get(`${config.apis.kiss2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`, {
                    responseType: 'arraybuffer'
                });
                const attachmentId = await uploadAttachment(altResponse.data, 'image');
                return {
                    attachment: {
                        type: 'image',
                        payload: {
                            attachment_id: attachmentId
                        }
                    }
                };
            } catch (altError) {
                console.error('Kiss Error:', error, 'Alt Error:', altError);
                return { text: 'Error generating image' };
            }
        }
    },

    billboard: async (sender_id, args) => {
        if (!args.length) return { text: 'Add text' };
        try {
            const response = await axios.get(`${config.apis.billboard}${encodeURIComponent(args.join(' '))}`, {
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
            console.error('Billboard Error:', error);
            return { text: 'Error generating image' };
        }
    },

    hangingBillboard: async (sender_id, args) => {
        if (!args.length) return { text: 'Add text' };
        try {
            const response = await axios.get(`${config.apis.hangingBillboard}${sender_id}&text=${encodeURIComponent(args.join(' '))}`, {
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
            console.error('Hanging Billboard Error:', error);
            return { text: 'Error generating image' };
        }
    }
};