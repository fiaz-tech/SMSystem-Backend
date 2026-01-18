import type { FastifyRequest, FastifyReply } from 'fastify';
import { updateSchoolSubscriptionService } from './subs.service.js';

export const updateSchoolSubscription = async (
    request: FastifyRequest<{
        Body: {
            schoolId: number;
            planId: number;
            status: 'pending' | 'active' | 'expired';
        };
    }>,
    reply: FastifyReply
) => {
    const { schoolId, planId, status } = request.body;

    await updateSchoolSubscriptionService(schoolId, planId, status);

    return reply.send({
        success: true,
        message: 'Subscription updated successfully'
    });
};
