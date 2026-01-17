import type { FastifyRequest, FastifyReply } from 'fastify';
import {
    createSchoolWithDefaults,
    getSchoolBySlugService,
    getSchoolByIdService,
    getAllSchoolsService,
    updateSchoolBySlugService,
    deleteSchoolBySlugService
} from './schools.service.js';
import { BadRequestError } from '../../utils/errors.js';
interface GetSchoolsQuery {
    page?: string;
    limit?: string;
}
//import { createSchoolAdminUser, applyFreeTier } from '../users/users.service.js';


export const createSchool = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const body = request.body as any;

    if (!body.name || !body.address || !body.phone || !body.email || !body.logo_url) {
        throw new BadRequestError('Required fields are missing');
    };

    const result = await createSchoolWithDefaults(body);


    return reply.status(201).send({
        success: true,
        message: 'School created successfully',
        data: result
    });
};

export const getSchoolBySlug = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { slug } = request.params as any;
    const school = await getSchoolBySlugService(slug);

    return reply.send({ success: true, data: school });
};

export const getSchoolById = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { id } = request.params as any;
    const school = await getSchoolByIdService(Number(id));

    return reply.send({ success: true, data: school });
};


export const getAllSchools = async (
    request: FastifyRequest<{ Querystring: GetSchoolsQuery }>,
    reply: FastifyReply
) => {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Number(request.query.limit) || 10, 100);

    const result = await getAllSchoolsService(page, limit);

    return reply.send({
        success: true,
        ...result
    });
};


export const updateSchoolBySlug = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { slug } = request.params as any;
    const updates = request.body as any;

    await updateSchoolBySlugService(slug, updates);

    return reply.send({
        success: true,
        message: 'School updated successfully'
    });
};

export const deleteSchoolBySlug = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { slug } = request.params as any;

    await deleteSchoolBySlugService(slug);

    return reply.send({
        success: true,
        message: 'School deleted successfully'
    });
};








