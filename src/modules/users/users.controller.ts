import type { FastifyRequest, FastifyReply } from 'fastify';
import { expandUsersAfterPaymentService } from './users.service.js';
import { BadRequestError } from '../../utils/errors.js';

export const expandUsersAfterPayment = async (
    request: FastifyRequest<{
        Body: {
            schoolId: number;
            studentLimit: number;
            teacherLimit: number;
            parentLimit: number;
        };
    }>,
    reply: FastifyReply
) => {

    const body = request.body as any;
    const {
        schoolId,
        studentLimit,
        teacherLimit,
        parentLimit
    } = request.body;

    await expandUsersAfterPaymentService(schoolId, {
        student: studentLimit,
        teacher: teacherLimit,
        parent: parentLimit
    });

    return reply.send({
        success: true,
        message: 'Users expanded successfully'
    });
};
