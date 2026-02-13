import type { FastifyRequest, FastifyReply } from "fastify";
import {
    assignSubjectToClassService,
    getSubjectsByClassService,
    removeSubjectFromClassService
} from "./classSubjects.service.js";


// assign subjects to Class controller
export const assignSubjectToClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {

    const { schoolId } = request.user as any;
    const { classId } = request.params as any;
    const { subjectId } = request.params as any;

    const result = await assignSubjectToClassService(
        schoolId,
        classId,
        subjectId
    );

    return reply.status(201).send({
        success: true,
        message: 'subject assigned to class successfully',
        data: result
    });
};


// GET subjects in a Class controller
export const getSubjectsByClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { schoolId } = request.user as any;
    const { classId } = request.params as any;

    const result = await getSubjectsByClassService(
        classId,
        schoolId
    );
    return reply.status(201).send({
        success: true,
        message: 'subjects assigned to class retrieved successfully',
        data: result
    });
};


// REMOVE subject from a Class controller
export const removeSubjectFromClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { schoolId } = request.user as any;
    const { classSubjectId } = request.params as any;

    const result = await removeSubjectFromClassService(
        classSubjectId,
        schoolId
    );
    return reply.status(201).send({
        success: true,
        message: 'subject removed from class successfully',
        data: result
    });
};