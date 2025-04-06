const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function initDb() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                name TEXT,
                message_count INTEGER DEFAULT 0,
                command_count INTEGER DEFAULT 0,
                join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_banned BOOLEAN DEFAULT FALSE,
                is_admin BOOLEAN DEFAULT FALSE,
                settings JSONB DEFAULT '{}'::jsonb
            );
            CREATE TABLE IF NOT EXISTS groups (
                group_id TEXT PRIMARY KEY,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                settings JSONB DEFAULT '{}'::jsonb
            );
            CREATE TABLE IF NOT EXISTS group_members (
                group_id TEXT,
                user_id TEXT,
                role TEXT DEFAULT 'member',
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (group_id, user_id)
            );
            CREATE TABLE IF NOT EXISTS commands_log (
                id SERIAL PRIMARY KEY,
                user_id TEXT,
                command TEXT,
                args TEXT[],
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } finally {
        client.release();
    }
}

module.exports = {
    init: initDb,
    pool: pool
};