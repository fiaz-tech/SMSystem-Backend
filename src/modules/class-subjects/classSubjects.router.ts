import type { FastifyInstance } from 'fastify';
import {
    assignSubjectToClass,
    getSubjectsByClass,
    removeSubjectFromClass
} from './classSubjects.controller.js';
import { authenticate, schoolAdminOnly } from '../../middlewares/authenticate.js';


export const subjectToClassRoutes = async (fastify: FastifyInstance) => {
    fastify.post(
        '/api/subjects/:classId/assign-subject/:subjectId',
        { preHandler: [authenticate, schoolAdminOnly] },
        assignSubjectToClass
    );

    fastify.get(
        '/api/class/classsubjects/:classId',
        { preHandler: [authenticate, schoolAdminOnly] },
        getSubjectsByClass
    );

    fastify.delete(
        '/api/class/classsubjects/:classSubjectId',
        { preHandler: [authenticate, schoolAdminOnly] },
        removeSubjectFromClass
    );

};


