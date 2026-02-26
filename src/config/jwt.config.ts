import jwt, {
    type Secret,
    type SignOptions,
    type JwtPayload,
} from 'jsonwebtoken';

//
// 1️⃣ Fail Fast – Never Allow Default Secret
//
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

const JWT_SECRET: Secret = process.env.JWT_SECRET;

//
// 2️⃣ Secure Defaults
//
const JWT_ISSUER = 'school-management-api';
const JWT_AUDIENCE = 'school-users';
const JWT_ALGORITHM: SignOptions['algorithm'] = 'HS256';
const JWT_EXPIRATION: SignOptions['expiresIn'] =
    (process.env.JWT_EXPIRATION as SignOptions['expiresIn']) ?? '15m';

//
// 3️⃣ Strongly Typed Payload
//
export interface AuthTokenPayload extends JwtPayload {
    userId: number;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    schoolId: number;
    tokenVersion?: number;
}

//
// 4️⃣ Keep Original Export Name: signToken
//
const signToken = (payload: Omit<AuthTokenPayload, 'iat' | 'exp'>) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
        algorithm: JWT_ALGORITHM,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });
};

//
// 5️⃣ Keep Original Export Name: verifyToken
//
const verifyToken = (token: string): AuthTokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET, {
            algorithms: [JWT_ALGORITHM], // Prevent algorithm confusion attack
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        }) as AuthTokenPayload;
    } catch {
        throw new Error('Invalid or expired token');
    }
};

export { signToken, verifyToken };
