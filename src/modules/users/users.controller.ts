import type { FastifyRequest, FastifyReply } from 'fastify';
import {
    expandUsersAfterPaymentService,
    getSchoolUsersBySchoolAdminService,
    resetUserPasswordService
} from './users.service.js';
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

export const resetUserPassword = async (
    request: FastifyRequest<{ Params: { userId: number } }>,
    reply: FastifyReply
) => {
    const result = await resetUserPasswordService(
        request.user.schoolId!,
        Number(request.params.userId)
    );

    return reply.send({
        success: true,
        message: 'Password reset successfully',
        data: result
    });
};


export const getSchoolUsersBySchoolAdmin = async (
    request: FastifyRequest<{
        Params: { schoolId: string; };
    }>,
    reply: FastifyReply
) => {

    const { schoolId } = request.params;
    const schoolUsers = await getSchoolUsersBySchoolAdminService(Number(schoolId));

    return reply.send({
        success: true,
        message: 'School Users fetched successfully',
        data: schoolUsers
    });
};

