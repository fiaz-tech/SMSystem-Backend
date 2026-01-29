import type { FastifyInstance } from 'fastify';
import {
    createSubject,
    getSchoolSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
} from './subjects.controller.js';
import { authenticate, schoolAdminOnly } from '../../middlewares/authenticate.js';


export const subjectRoutes = async (fastify: FastifyInstance) => {

    //school admin / Create subject
    fastify.post(
        '/api/subjects',
        { preHandler: [authenticate, schoolAdminOnly] },
        createSubject
    );
    fastify.get(
        '/api/subjects',
        { preHandler: [authenticate, schoolAdminOnly] },
        getSchoolSubjects
    );
    fastify.get(
        '/api/subjects/:id',
        { preHandler: [authenticate, schoolAdminOnly] },
        getSubjectById
    );

    fastify.put(
        '/api/subjects/:id',
        { preHandler: [authenticate, schoolAdminOnly] },
        updateSubject
    );

    //NWWW
    fastify.delete(
        '/api/subjects/:id',
        { preHandler: [authenticate, schoolAdminOnly] },
        deleteSubject
    );


};


