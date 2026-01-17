import type { FastifyRequest, FastifyReply } from 'fastify';
import { expandUsersAfterPaymentService } from './users.service.js';

export const expandUsersAfterPayment = async (
    request: FastifyRequest<{
        Body: {
            schoolId: number;
            schoolName: string;
            studentLimit: number;
            teacherLimit: number;
            parentLimit: number;
        };
    }>,
    reply: FastifyReply
) => {
    const {
        schoolId,
        schoolName,
        studentLimit,
        teacherLimit,
        parentLimit
    } = request.body;

    await expandUsersAfterPaymentService(schoolId, schoolName, {
        student: studentLimit,
        teacher: teacherLimit,
        parent: parentLimit
    });

    return reply.send({
        success: true,
        message: 'Users expanded successfully'
    });
};
