import type { FastifyRequest, FastifyReply } from 'fastify';
import { loginService } from './auth.service.js';
import { updatePasswordService } from './auth.service.js';


export const login = async (
    request: FastifyRequest<{
        Body: { username: string; password: string };
    }>,
    reply: FastifyReply
) => {
    const { username, password } = request.body;

    const data = await loginService(username, password);

    return reply.send({
        success: true,
        ...data
    });
};


// Change Password from default
export const changePassword = async (
    request: FastifyRequest<{ Body: { password: string } }>,
    reply: FastifyReply
) => {

    await updatePasswordService(request.user.id, request.body.password);

    return reply.send({
        success: true,
        message: 'Password updated successfully'
    });
};

