import mysql from 'mysql2';
// Set up MySQL connection pool
const dbConfig = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'school_management_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Export a promise-based connection for asynchronous queries
const db = dbConfig.promise();
export default db;
//# sourceMappingURL=db.config.js.map