import type { FastifyRequest } from 'fastify';
import { ForbiddenError } from '../utils/errors.js';


export const forcePasswordChange = async (
    request: FastifyRequest
) => {
    if (request.user?.mustChangePassword) {
        throw new ForbiddenError('You must change your password before accesing this resource');
    }
};


