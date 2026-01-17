import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../../config/db.config.js';
import type { RowDataPacket } from 'mysql2';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

interface UserRow extends RowDataPacket {
    username: string;
}

export const loginUser = async (
    request: FastifyRequest,
    reply: FastifyReply) => {
    const { username, password } = request.body as { username: string; password: string };

    const [user] = await db.query<UserRow[]>(
        'SELECT * FROM users WHERE username = ?',
        [username]);

    if (!user[0]) {
        throw new NotFoundError('Invalid username or password');
    }

    const userData = user[0];

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, userData.password_hash);


    if (!isPasswordValid) {
        throw new NotFoundError('Invalid username or password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: userData.id, role: userData.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return reply.send({ token });

    return reply.status(201).send({
        success: true,
        message: 'User logged in successfully',
    });
};


