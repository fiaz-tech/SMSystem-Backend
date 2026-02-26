import type { FastifyRequest, FastifyReply } from "fastify";
import {
    assignStudentToClassService,
    getStudentsByClassService,
    updateStudentClassService,
    removeStudentFromClassService

} from "./studentClasses.service.js";
import { BadRequestError } from "../../utils/errors.js";
import { autoAssignSubjectsToStudent } from "../student_subjects/studentSubjects.service.js";

// assign subjects to Class controller
export const assignStudentToClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {

    const { schoolId } = request.user;
    const { studentId } = request.body as any;
    const { classId } = request.params as any;

    const result = await assignStudentToClassService(
        schoolId,
        classId,
        studentId,
    );

    await autoAssignSubjectsToStudent(
        schoolId,
        studentId,
        classId
    )

    return reply.status(201).send({
        success: true,
        message: 'Student assigned to class successfully',
        data: result
    });
};


// GET students By Class
export const getStudentsByClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { schoolId } = request.user;
    const { classId } = request.params as any;

    const result = await getStudentsByClassService(
        classId,
        schoolId
    );

    return reply.status(201).send({
        success: true,
        message: 'Students in class fetched successfully',
        data: result
    });
};

//UPDATE Move student to another Class
export const updateStudentClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { schoolId } = request.user;
    const { classId } = request.params as any;
    const { studentId } = request.body as any;

    if (!studentId) {
        throw new BadRequestError("required field missing");
    }

    const result = await updateStudentClassService(
        studentId,
        classId,
        schoolId
    );

    return reply.status(201).send({
        success: true,
        message: "Student's class changed successfully",
        data: result
    });
};


//REMOVE studen from a Class
export const removeStudentFromClass = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {

    const { studentId } = request.body as any;
    const { schoolId } = request.user;

    if (!studentId) {
        throw new BadRequestError("required field missing");
    }

    const result = await removeStudentFromClassService(
        studentId,
        schoolId
    );

    return reply.status(201).send({
        success: true,
        message: "Student removed from class successfully",
        data: result
    });
};