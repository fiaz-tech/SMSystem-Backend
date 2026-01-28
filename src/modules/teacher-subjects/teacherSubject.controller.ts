import type { FastifyRequest } from "fastify/types/request.js";
import { assignTeacherToSubjectService } from "./teacherSubjects.service.js";


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
