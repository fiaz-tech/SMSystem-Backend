import type { FastifyInstance } from 'fastify';
import {
    expandUsersAfterPayment
} from './users.controller.js';

export const userRoutes = async (fastify: FastifyInstance) => {

    fastify.post('/api/schools/:schoolId/expand-users', expandUsersAfterPayment);
};
