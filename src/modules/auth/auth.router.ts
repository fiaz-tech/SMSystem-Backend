import type { FastifyInstance } from 'fastify';
import { login, changePassword } from './auth.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';


export const authRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/login', login);

    fastify.post<{ Body: { password: string } }>(
        '/auth/change-pasword',
        { preHandler: [authenticate] },
        changePassword
    )
};


