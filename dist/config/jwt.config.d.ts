import jwt from 'jsonwebtoken';
declare const signToken: (payload: string | object) => string;
declare const verifyToken: (token: string) => string | jwt.JwtPayload;
export { signToken, verifyToken };
//# sourceMappingURL=jwt.config.d.ts.map