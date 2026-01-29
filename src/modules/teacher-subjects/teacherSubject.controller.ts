import type { FastifyRequest } from "fastify/types/request.js";
import {
    assignTeacherToSubjectService,
    updateTeacherAssignmentService,
    getSubjectsByTeacherService,
    getTeachersBySubjectService

} from "./teacherSubjects.service.js";
import type { FastifyReply } from "fastify";


export const assignTeacherToSubject = async (request: FastifyRequest) => {
    const { subjectId } = request.params as any;
    const { teacherId } = request.body as any;
    const { schoolId, id: adminId } = request.user;

    await assignTeacherToSubjectService({
        subjectId,
        teacherId,
        schoolId,
        adminId
    });

    return { message: 'Teacher assigned successfully' };
};


export const updateTeacherAssignment = async (request: FastifyRequest) => {
    const { assignmentId } = request.params as any;
    const { schoolId } = request.user as any;
    const { newTeacherId } = request.body as any;

    await updateTeacherAssignmentService(
        assignmentId,
        schoolId,
        newTeacherId
    );

    return { message: 'Teacher assigned successfully' };
};


//Get Subjcts assigned to teacher controller
export const getSubjectsByTeacher = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { teacherId } = request.params as any;
    const { schoolId } = request.user;

    const teacherSubjects = await getSubjectsByTeacherService(
        teacherId,
        schoolId
    );

    return reply.send({ success: true, data: teacherSubjects });
};


//GET Teachers assigned to subject controller
export const getTeachersBySubject = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { subjectId } = request.params as any;
    const { schoolId } = request.user;

    const subjectTeachers = await getTeachersBySubjectService(
        subjectId,
        schoolId
    );

    return reply.send({ success: true, data: subjectTeachers });
};
