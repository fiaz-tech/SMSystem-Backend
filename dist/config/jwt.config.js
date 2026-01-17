import jwt from 'jsonwebtoken';
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}
const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION ?? '1h';
const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
    });
};
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        throw new Error('Invalid or expired token');
    }
};
export { signToken, verifyToken };
//# sourceMappingURL=jwt.config.js.map