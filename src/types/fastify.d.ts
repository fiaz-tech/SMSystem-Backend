import "fastify";

declare module "fastify" {
    interface FastifyRequest {
        user: {
            id: number;
            role: string;
            schoolId: number;
            role: string;
            mustChangePassword: boolean;
        };
    }
}
