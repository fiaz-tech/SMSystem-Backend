import db from '../../config/db.config.js';
const createUser = async (userData) => {
    const { username, password, role } = userData;
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [username, password, role]);
    return result;
};
`
const getUserByUsername = async (username: string) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await db.query(query, [username]);
    return rows[0];
};
`;
export { createUser }; //getUserByUsername 
//# sourceMappingURL=users.model.js.map