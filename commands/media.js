const axios = require('axios');
const config = require('../config/config');

module.exports = {
    shoti: async () => {
        try {
            const response = await axios.get(config.apis.shoti, {
                responseType: 'arraybuffer'
            });
            return {
                attachment: {
                    type: 'video',
                    payload: {
                        is_reusable: true,
                        attachment_id: Buffer.from(response.data, 'binary').toString('base64')
                    }
                }
            };
        } catch {
            try {
                const altResponse = await axios.get(config.apis.shotiAlt, {
                    responseType: 'arraybuffer'
                });
                return {
                    attachment: {
                        type: 'video',
                        payload: {
                            is_reusable: true,
                            attachment_id: Buffer.from(altResponse.data, 'binary').toString('base64')
                        }
                    }
                };
            } catch {
                return 'Error fetching video';
            }
        }
    },

    spotify: async (sender_id, args) => {
        if (!args.length) return 'Usage: !spotify <song>';
        try {
            const response = await axios.get(`${config.apis.spotify}${encodeURIComponent(args.join(' '))}`, {
                responseType: 'arraybuffer'
            });
            return {
                attachment: {
                    type: 'audio',
                    payload: {
                        is_reusable: true,
                        attachment_id: Buffer.from(response.data, 'binary').toString('base64')
                    }
                }
            };
        } catch {
            return 'Error searching song';
        }
    },

    flux: async (sender_id, args) => {
        if (!args.length) return 'Usage: !flux <prompt>';
        try {
            const response = await axios.get(`${config.apis.flux}${encodeURIComponent(args.join(' '))}`, {
                responseType: 'arraybuffer'
            });
            return {
                attachment: {
                    type: 'image',
                    payload: {
                        is_reusable: true,
                        attachment_id: Buffer.from(response.data, 'binary').toString('base64')
                    }
                }
            };
        } catch {
            return 'Error generating image';
        }
    },

    fluxweb: async (sender_id, args) => {
        if (!args.length) return 'Usage: !fluxweb <prompt>';
        try {
            const response = await axios.get(`${config.apis.fluxweb}${encodeURIComponent(args.join(' '))}`, {
                responseType: 'arraybuffer'
            });
            return {
                attachment: {
                    type: 'image',
                    payload: {
                        is_reusable: true,
                        attachment_id: Buffer.from(response.data, 'binary').toString('base64')
                    }
                }
            };
        } catch {
            return 'Error generating image';
        }
    },

    cdp: async () => {
        try {
            const response = await axios.get(config.apis.cdp, {
                responseType: 'arraybuffer'
            });
            return {
                attachment: {
                    type: 'image',
                    payload: {
                        is_reusable: true,
                        attachment_id: Buffer.from(response.data, 'binary').toString('base64')
                    }
                }
            };
        } catch {
            return 'Error fetching image';
        }
    },

    ba: async () => {
        try {
            const response = await axios.get(config.apis.ba, {
                responseType: 'arraybuffer'
            });
            return {
                attachment: {
                    type: 'image',
                    payload: {
                        is_reusable: true,
                        attachment_id: Buffer.from(response.data, 'binary').toString('base64')
                    }
                }
            };
        } catch {
            return 'Error fetching image';
        }
    }
};