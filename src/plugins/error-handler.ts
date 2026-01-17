import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function errorHandler(fastify: FastifyInstance) {
    fastify.setErrorHandler((
        error: FastifyError,
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const statusCode = error.statusCode ?? 500;

        reply.status(statusCode).send({
            success: false,
            message: error.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    });
}
