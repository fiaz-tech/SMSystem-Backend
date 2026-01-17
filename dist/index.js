import Fastify from 'fastify';
import { signToken, verifyToken } from './config/jwt.config.js';
const app = Fastify({ logger: true });
// Example route for testing JWT signing and verification
app.post('/api/auth/login', async (request, reply) => {
    const { username, password } = request.body;
    // Simulate successful authentication
    const payload = { username, role: 'user' };
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
    }
    catch (error) {
        return reply.status(401).send('Invalid or expired token');
    }
});
// Start the Fastify server
const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server started at http://localhost:3000');
    }
    catch (err) {
        app.log.error(err);
        console.log(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map