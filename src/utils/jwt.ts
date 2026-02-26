import jwt, {
    type JwtPayload,
    type SignOptions,
} from 'jsonwebtoken';

//
//  Fail fast if secret is missing
//
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;

//
//  Secure configuration
//
const JWT_ALGORITHM: SignOptions['algorithm'] = 'HS256';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = '15m';
const JWT_ISSUER = 'school-management-api';
const JWT_AUDIENCE = 'school-users';

//
//  Strongly typed payload
//
export interface AuthTokenPayload extends JwtPayload {
    id: number;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    schoolId?: number;
    mustChangePassword: boolean;
}

//
// Secure signToken
//
export const signToken = (
    payload: Omit<AuthTokenPayload, 'iat' | 'exp'>
): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: JWT_ALGORITHM,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });
};

//
// Secure verifyToken
//
export const verifyToken = (token: string): AuthTokenPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: [JWT_ALGORITHM], // Prevent algorithm confusion
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        });

        return decoded as AuthTokenPayload;
    } catch {
        throw new Error('Invalid or expired token');
    }
};
