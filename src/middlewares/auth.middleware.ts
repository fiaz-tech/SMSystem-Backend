import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '../utils/errors.js';

interface JwtPayload {
    userId: string;
    schoolId: string;
    role: string;
}

const verifyJWT = (requiredRoles: string[] = []) => {
    return async (
        request: FastifyRequest,
        _reply: FastifyReply) => {
        const authHeader = request.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if (!token) {
            throw new UnauthorizedError('Authorization token is required');
        }

        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        if (
            requiredRoles.length > 0 &&
            !requiredRoles.includes(decoded.role)
        ) {
            throw new ForbiddenError('Permission denied');
        }

        request.user = decoded;
        return;


    };

}

export { verifyJWT };
