import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';


const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION: SignOptions['expiresIn'] = (process.env.JWT_EXPIRATION as SignOptions['expiresIn']) ?? '1h';

const signToken = (payload: string | object) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
    });
};

const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        throw new Error('Invalid or expired token');
    }
};

export { signToken, verifyToken };
