import type { FastifyInstance } from 'fastify';
import { updateSchoolSubscription } from './subs.controller.js';

export const subscriptionRoutes = async (fastify: FastifyInstance) => {
    fastify.patch(
        '/api/internal/subscriptions/update',
        updateSchoolSubscription
    );
};
