import type { FastifyError } from "fastify";


export class AppError extends Error implements FastifyError {
    code: string;
    statusCode: number;


    constructor(
        message: string,
        statusCode = 500,
        code: string = "APP_ERROR"
    ) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, "RESOURCE NOT FOUND");
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 400, "BAD_REQUEST");
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, "AUTH_UNAUTHORIZED");
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, "ACCESS DENIED");
    }
}
