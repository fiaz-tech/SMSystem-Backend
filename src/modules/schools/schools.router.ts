import type { FastifyInstance } from 'fastify';
import {
    createSchool,
    getSchoolBySlug,
    getSchoolById,
    getAllSchools,
    updateSchoolBySlug,
    deleteSchoolBySlug

} from './schools.controller.js';

export const schoolRoutes = async (fastify: FastifyInstance) => {
    //public routes
    fastify.get('/api/schools/:slug', getSchoolBySlug);
    fastify.post('/api/schools', createSchool);

    //school admin /internal
    fastify.get('/api/admin/schools/:id', getSchoolById);
    fastify.put('/api/schools/:slug', updateSchoolBySlug);


    //super admin route
    fastify.get('/api/schools', getAllSchools);
    fastify.delete('/api/schools/:slug', deleteSchoolBySlug);

};


