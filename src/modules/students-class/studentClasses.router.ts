import type { FastifyInstance } from 'fastify';
import {
    assignStudentToClass,
    getStudentsByClass,
    updateStudentClass,
    removeStudentFromClass
} from './studentClasses.controller.js';
import { authenticate, schoolAdminOnly } from '../../middlewares/authenticate.js';


export const studentToClassRoutes = async (fastify: FastifyInstance) => {
    fastify.post(
        '/api/classes/students/:classId',
        { preHandler: [authenticate, schoolAdminOnly] },
        assignStudentToClass
    );
    fastify.get(
        '/api/classes/students/:classId',
        { preHandler: [authenticate, schoolAdminOnly] },
        getStudentsByClass
    );
    fastify.put(
        '/api/classes/students/:classId',
        { preHandler: [authenticate, schoolAdminOnly] },
        updateStudentClass
    );
    fastify.delete(
        '/api/classes/student',
        { preHandler: [authenticate, schoolAdminOnly] },
        removeStudentFromClass
    );





};


