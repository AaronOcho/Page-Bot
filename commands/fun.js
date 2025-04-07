const axios = require('axios');
const config = require('../config/config');

module.exports = {
    slap: async (sender_id, args) => {
        if (args.length < 2) return 'Tag 2 users';
        try {
            const response = await axios.get(`${config.apis.slap}${encodeURIComponent(args[0])}&superman=${encodeURIComponent(args[1])}`, {
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
            try {
                const altResponse = await axios.get(`${config.apis.slapv2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`, {
                    responseType: 'arraybuffer'
                });
                return {
                    attachment: {
                        type: 'image',
                        payload: {
                            is_reusable: true,
                            attachment_id: Buffer.from(altResponse.data, 'binary').toString('base64')
                        }
                    }
                };
            } catch {
                return 'Error generating image';
            }
        }
    },

    kiss: async (sender_id, args) => {
        if (args.length < 2) return 'Tag 2 users';
        try {
            const response = await axios.get(`${config.apis.kiss}${encodeURIComponent(args[0])}&userid2=${encodeURIComponent(args[1])}`, {
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
            try {
                const altResponse = await axios.get(`${config.apis.kiss2}${encodeURIComponent(args[0])}&two=${encodeURIComponent(args[1])}`, {
                    responseType: 'arraybuffer'
                });
                return {
                    attachment: {
                        type: 'image',
                        payload: {
                            is_reusable: true,
                            attachment_id: Buffer.from(altResponse.data, 'binary').toString('base64')
                        }
                    }
                };
            } catch {
                return 'Error generating image';
            }
        }
    },

    billboard: async (sender_id, args) => {
        if (!args.length) return 'Add text';
        try {
            const response = await axios.get(`${config.apis.billboard}${encodeURIComponent(args.join(' '))}`, {
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

    hangingBillboard: async (sender_id, args) => {
        if (!args.length) return 'Add text';
        try {
            const response = await axios.get(`${config.apis.hangingBillboard}${sender_id}&text=${encodeURIComponent(args.join(' '))}`, {
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
    }
};