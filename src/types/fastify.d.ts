import "fastify";

declare module "fastify" {
    interface FastifyRequest {
        user: {
            user_id: string;
            school_id: string;
            role: string;
        };
    }
}
