import type { FastifyInstance } from 'fastify';
import {
    respondToSubject,
    getStudentSubject
} from './studentSubject.controller.js';
import { authenticate, schoolAdminOnly, schoolStudentOnly } from '../../middlewares/authenticate.js';


export const studentSubjectRoutes = async (fastify: FastifyInstance) => {
    fastify.put(
        '/api/student/subjects/respond',
        { preHandler: [authenticate, schoolStudentOnly] },
        respondToSubject
    );
    fastify.get(
        '/api/student/subjects',
        { preHandler: [authenticate, schoolStudentOnly] },
        getStudentSubject
    );

};


