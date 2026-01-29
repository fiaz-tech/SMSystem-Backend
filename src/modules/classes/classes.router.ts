import type { FastifyInstance } from 'fastify';
import {
    createClass,
    getSchoolClasses,
    updateClass,
    deleteClass
} from './classes.controller.js';
import { authenticate, schoolAdminOnly } from '../../middlewares/authenticate.js';

export const classRoutes = async (fastify: FastifyInstance) => {

    //school admin Create class
    fastify.post(
        '/api/class',
        { preHandler: [authenticate, schoolAdminOnly] },
        createClass
    );

    //GET school classes by Admin
    fastify.get(
        '/api/classes',
        { preHandler: [authenticate, schoolAdminOnly] },
        getSchoolClasses
    );

    //UPDATE school class by Admin
    fastify.put(
        '/api/class/:classId',
        { preHandler: [authenticate, schoolAdminOnly] },
        updateClass
    );

    //DELETE school class by Admin
    fastify.delete(
        '/api/class/:classId',
        { preHandler: [authenticate, schoolAdminOnly] },
        deleteClass
    );

};
