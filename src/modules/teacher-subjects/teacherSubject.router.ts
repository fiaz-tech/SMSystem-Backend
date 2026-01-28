import type { FastifyInstance } from 'fastify';
import { assignTeacherToSubject } from './teacherSubject.controller.js';
import { authenticate, schoolAdminOnly } from '../../middlewares/authenticate.js';


export const teacherSubjectRoutes = async (fastify: FastifyInstance) => {

    fastify.post(
        '/api/subjects/:subjectId/assign-teacher',
        { preHandler: [authenticate, schoolAdminOnly] },
        assignTeacherToSubject
    );






};


