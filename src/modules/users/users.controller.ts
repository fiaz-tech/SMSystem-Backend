import type { FastifyRequest, FastifyReply } from 'fastify';
import { expandUsersAfterPaymentService } from './users.service.js';
import { BadRequestError } from '../../utils/errors.js';

export const expandUsersAfterPayment = async (
    request: FastifyRequest<{
        Params: { schoolId: number };
    }>,
    reply: FastifyReply
) => {

    const { schoolId } = request.params;
    await expandUsersAfterPaymentService(schoolId);

    return reply.send({
        success: true,
        message: 'Users expanded based on subscription plan successfully'
    });
};
