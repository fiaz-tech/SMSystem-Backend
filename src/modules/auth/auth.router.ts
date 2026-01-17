import type { FastifyInstance } from 'fastify';
import { loginUser } from './auth.controller.js';

const authRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/api/auth/login', loginUser);
};

export default authRoutes;
