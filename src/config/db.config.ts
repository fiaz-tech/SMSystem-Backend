import { createPool } from 'mysql2/promise';
import { env } from './env.js';


const db = createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: '',
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default db;

/** 
import { createPool, Pool } from 'mysql2/promise';

// Set up MySQL connection pool
const db: Pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'school_management_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export a promise-based connection for asynchronous queries
//const db = dbConfig.promise();

export default db;
*/
