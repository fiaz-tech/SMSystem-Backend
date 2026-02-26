import type { FastifyRequest, FastifyReply } from "fastify";

import {
    respondToSubjectService,
    getStudentSubjectsService
} from "./studentSubjects.service.js";


export const respondToSubject = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {

    const studentId = request.user.id;
    const { subjectId, action } = request.body as any;

    const result = await respondToSubjectService(
        studentId,
        subjectId,
        action);

    return reply.status(201).send({
        success: true,
        message: 'Student response to subject successfull',
    });
};


export const getStudentSubject = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {

    const studentId = request.user.id;


    const result = await getStudentSubjectsService(
        studentId,
    );
    return reply.status(201).send({
        success: true,
        message: 'Student subject fetched successfully',
        data: result
    });
};