import type { FastifyInstance } from 'fastify';
import {
    assignTeacherToSubject,
    updateTeacherAssignment,
    getSubjectsByTeacher,
    getTeachersBySubject
} from './teacherSubject.controller.js';
import { authenticate, schoolAdminOnly } from '../../middlewares/authenticate.js';


export const teacherSubjectRoutes = async (fastify: FastifyInstance) => {

    fastify.post(
        '/api/subjects/:subjectId/assign-teacher',
        { preHandler: [authenticate, schoolAdminOnly] },
        assignTeacherToSubject
    );

    fastify.get(
        '/api/subjects/assign-teacher/:teacherId',
        { preHandler: [authenticate, schoolAdminOnly] },
        getSubjectsByTeacher
    );
    fastify.get(
        '/api/teachers/assign-subject/:subjectId',
        { preHandler: [authenticate, schoolAdminOnly] },
        getTeachersBySubject
    );


    fastify.put(
        '/subjects/assign-teacher/:assignmentId',
        { preHandler: [authenticate, schoolAdminOnly] },
        updateTeacherAssignment
    );







};


