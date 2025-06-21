// scripts/createdatabase.js

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const {
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_DATABASE
} = process.env;

if (
  !DB_USER || !DB_HOST || !DB_PASSWORD ||
  !DB_PORT || !DB_DATABASE
) {
  console.error("Missing required environment variables. Please check your .env file.");
  process.exit(1);
}

const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  port: parseInt(DB_PORT, 10),
  database: 'postgres', // Connect to default DB to create the target DB
});

const createDatabase = async () => {
  try {
    await client.connect();
    await client.query(`CREATE DATABASE "${DB_DATABASE}"`);
    console.log(`✅ Database '${DB_DATABASE}' created successfully.`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`ℹ️ Database '${DB_DATABASE}' already exists.`);
    } else {
      console.error('❌ Error creating database:', err.message);
    }
  } finally {
    await client.end();
  }
};

createDatabase();
