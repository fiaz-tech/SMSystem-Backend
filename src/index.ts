import Fastify from 'fastify';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import dotenv from 'dotenv';
import type { PoolConnection } from 'mysql2/promise';
import { signToken, verifyToken } from './config/jwt.config.js';
import { errorHandler } from './plugins/error-handler.js';
import { schoolRoutes } from './modules/schools/schools.router.js';
import { userRoutes } from './modules/users/users.router.js';
import { subscriptionRoutes } from './modules/subscriptions/subs.router.js';
import { authRoutes } from './modules/auth/auth.router.js'
import { AppError } from './utils/errors.js';
import { subjectRoutes } from './modules/subjects/subjects.router.js';
import { teacherSubjectRoutes } from './modules/teacher-subjects/teacherSubject.router.js';
import { classRoutes } from './modules/classes/classes.router.js';

const app = Fastify({ logger: true });


app.addHook(
    'onError',
    async (request: any, reply, error) => {
        const conn: PoolConnection | undefined =
            request.dbConnection;

        if (conn) {
            try {
                await conn.rollback();
                conn.release();
            } catch { }
        }
    }
);

app.setErrorHandler((error, request, reply) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof Error) {
        message = error.message;
    }

    reply.status(statusCode).send({
        success: false,
        message
    });
});


app.register(schoolRoutes);
app.register(userRoutes);
app.register(subscriptionRoutes);
app.register(authRoutes);
app.register(subjectRoutes);
app.register(teacherSubjectRoutes);
app.register(classRoutes);


dotenv.config();
await errorHandler(app);


interface LoginRequest {
    username: string;
    password: string;
}

// Example route for testing JWT signing and verification
app.post('/api/auth/login', async (request, reply) => {
    const { username, password } = request.body as LoginRequest;

    // Simulate successful authentication
    const payload = { username, role: 'user' };
    console.log(payload);
    const token = signToken(payload); // Sign the token
    return { token };
});

app.get('/api/protected', async (request, reply) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
        return reply.status(401).send('Authorization header missing');
    }


    const [scheme, token] = authHeader.split(' '); // Get token from "Bearer <token>"

    if (scheme !== 'Bearer' || !token) {
        return reply.status(401).send('Invalid authorization format');
    }

    try {
        const decoded = verifyToken(token);
        return { message: 'Access granted', decoded };
    } catch (error) {
        return reply.status(401).send('Invalid or expired token');
    }
});





// Start the Fastify server
const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server started at http://localhost:3000');
    } catch (err) {
        app.log.error(err);
        console.log(err);
        process.exit(1);
    }
};

start();
