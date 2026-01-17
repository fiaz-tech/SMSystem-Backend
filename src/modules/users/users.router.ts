import type { FastifyInstance } from 'fastify';
import {
    expandUsersAfterPayment
} from './users.controller.js';

export const userRoutes = async (fastify: FastifyInstance) => {

    fastify.post('/users/upgrade', expandUsersAfterPayment);
};
