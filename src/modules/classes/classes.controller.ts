import type { FastifyRequest, FastifyReply } from "fastify";
import {
    createClassService,
    getClassesService,
    updateClassService,
    deleteClassService
} from "./classes.service.js";
import { BadRequestError } from "../../utils/errors.js";


// create Class controller
export const createClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { name } = request.body as any;
    if (!name) {
        throw new BadRequestError("required field missing")
    }
    const result = await createClassService(request.user.schoolId, name);

    return reply.status(201).send({
        success: true,
        message: `${name} class created successfully`,
        data: result
    });
};


//GET all Classes controller
export const getSchoolClasses = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const schoolClasses = await getClassesService(request.user.schoolId);

    return reply.status(201).send({
        success: true,
        message: "School Classes fetched successfully",
        data: schoolClasses
    });
}


//Update Class controller
export const updateClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { classId } = request.params as any;
    const { name } = request.body as any

    const result = await updateClassService(
        classId,
        request.user.schoolId,
        name
    );

    return reply.status(201).send({
        success: true,
        message: `${name} class updated successfully`,
        data: result
    });
};

//Delete Class controller
export const deleteClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { classId } = request.params as any;

    await deleteClassService(
        classId,
        request.user.schoolId,
    );

    return reply.status(201).send({
        success: true,
        message: 'class deleted successfully'
    });
};



