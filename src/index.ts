import Fastify from 'fastify';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import dotenv from 'dotenv';
import type { PoolConnection } from 'mysql2/promise';
import { errorHandler } from './plugins/error-handler.js';
import { schoolRoutes } from './modules/schools/schools.router.js';
import { userRoutes } from './modules/users/users.router.js';
import { subscriptionRoutes } from './modules/subscriptions/subs.router.js';
import { authRoutes } from './modules/auth/auth.router.js'
import { AppError } from './utils/errors.js';
import { subjectRoutes } from './modules/subjects/subjects.router.js';
import { teacherSubjectRoutes } from './modules/teacher-subjects/teacherSubject.router.js';
import { classRoutes } from './modules/classes/classes.router.js';
import { subjectToClassRoutes } from './modules/class-subjects/classSubjects.router.js';
import { studentToClassRoutes } from './modules/students_class/studentClasses.router.js';
import { studentSubjectRoutes } from './modules/student_subjects/studentSubject.router.js';

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
app.register(subjectToClassRoutes);
app.register(studentToClassRoutes);
app.register(studentSubjectRoutes);


dotenv.config();
await errorHandler(app);


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
