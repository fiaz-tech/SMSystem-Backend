import "fastify";
import { AuthTokenPayload } from "../utils/jwt.ts";

declare module "fastify" {
    interface FastifyRequest {
        user: AuthTokenPayload;
    }
}
