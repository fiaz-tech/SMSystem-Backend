import type { FastifyRequest, FastifyReply } from 'fastify';
import {
    createSubjectService,
    getSchoolSubjectsService,
    getSubjectByIdService,
    updateSubjectService,
    deleteSubjectService

} from './subjects.service.js';


export const createSubject = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { name, code } = request.body as any;
    const { schoolId, id: adminId } = request.user;

    const subject = await createSubjectService({
        name,
        code,
        schoolId,
        adminId
    });

    return reply.status(201).send({
        success: true,
        message: `${name} Subject created successfully`,
        data: subject
    });
};

//GET SCHOOL Subjects
export const getSchoolSubjects = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const schoolSubjects = await getSchoolSubjectsService(request.user.schoolId);

    return reply.send({ success: true, data: schoolSubjects });

}

// get subject by id controller
export const getSubjectById = async (request: FastifyRequest) => {
    const { id } = request.params as any;
    return await getSubjectByIdService(id, request.user.schoolId);
};

// subjects.controllers.ts
export const updateSubject = async (request: FastifyRequest) => {
    const { id } = request.params as any;
    return await updateSubjectService(
        id,
        request.user.schoolId,
        request.body as any
    );
};

//DELETE Suject
// subjects.controllers.ts
export const deleteSubject = async (request: FastifyRequest) => {
    const { id } = request.params as any;
    return await deleteSubjectService(
        id,
        request.user.schoolId,
    );
};



