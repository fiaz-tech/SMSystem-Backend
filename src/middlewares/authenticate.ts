import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

export const authenticate = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new UnauthorizedError('Authorization token is required');
    }

    const decoded = verifyToken(token);

    request.user = decoded as {
        id: number;
        role: string;
        schoolId: number;
        mustChangePassword: boolean;
    };
};

export const schoolAdminOnly = async (request: FastifyRequest) => {
    if (request.user.role !== 'admin') {
        throw new ForbiddenError('School admin access only');
    }
};

