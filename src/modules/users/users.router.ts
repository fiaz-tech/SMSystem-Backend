import type { FastifyInstance } from 'fastify';
import {
    expandUsersAfterPayment,
    resetUserPassword,
    getSchoolUsersBySchoolAdmin
} from './users.controller.js';
import { authenticate, schoolAdminOnly } from '../../middlewares/authenticate.js';

export const userRoutes = async (fastify: FastifyInstance) => {

    fastify.post('/api/schools/:schoolId/expand-users', expandUsersAfterPayment);
    fastify.get<{ Params: { schoolId: string } }>(
        '/api/schools/admin/:schoolId',
        { preHandler: [authenticate, schoolAdminOnly] },
        getSchoolUsersBySchoolAdmin
    );
    fastify.post<{ Params: { userId: number } }>(
        '/users/:userId/reset-password',
        { preHandler: [authenticate, schoolAdminOnly] },
        resetUserPassword
    );


};
