import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

export const authenticate = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new UnauthorizedError('Authorization token is required');
    }

    const decoded = verifyToken(token);

    request.user = decoded as {
        id: number;
        role: 'admin' | 'teacher' | 'student' | 'parent';
        schoolId: number;
        mustChangePassword: boolean;
    };
};

export const schoolAdminOnly = async (request: FastifyRequest) => {
    if (request.user.role !== 'admin') {
        throw new ForbiddenError('School admin access only');
    }
};

export const schoolStudentOnly = async (request: FastifyRequest) => {
    if (request.user.role !== 'student') {
        throw new ForbiddenError('School student access only');
    }
};

export const schoolTeacherOnly = async (request: FastifyRequest) => {
    if (request.user.role !== 'teacher') {
        throw new ForbiddenError('School admin access only');
    }
};

