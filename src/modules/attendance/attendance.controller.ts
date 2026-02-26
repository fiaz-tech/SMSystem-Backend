import type { FastifyRequest, FastifyReply } from "fastify";
import {
    getStudentsForSubjectAttendanceService,
    markAttendanceService
} from "./attendance.service.js";

type AttendanceStatus = 'present' | 'absent' | 'late';

interface AttendanceItem {
    studentId: number;
    status: AttendanceStatus;
}

interface MarkAttendanceBody {
    classId: number;
    subjectId: number;
    attendanceList: AttendanceItem[];
}

export const getStudentsForSubjectAttendance = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {

    const { subjectId, classId } = request.body as any;

    const result = await getStudentsForSubjectAttendanceService(
        classId,
        subjectId,
    );

    return reply.status(201).send({
        success: true,
        message: 'Student response to subject successfull',
    });
};


export const marktAttendanceController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {

    const { classId, subjectId, attendanceList } = request.body as any;


    //Basic Validation
    if (!classId || !subjectId || !attendanceList) {
        return reply.status(400).send({
            message: 'classId, subjectId and attendanceList are required'
        });
    }

    if (!Array.isArray(attendanceList) || attendanceList.length === 0) {
        return reply.status(400).send({
            message: 'attendanceList must be a non-empty array'
        });
    }

    // Validate each attendance item
    for (const item of attendanceList) {
        if (
            typeof item.studentId !== 'number' ||
            !['present', 'absent', 'late'].includes(item.status)
        ) {
            return reply.status(400).send({
                message: 'Invalid attendanceList format'
            });
        }
    }

    const teacherId = request.user.id;
    const schoolId = request.user.schoolId as any;


    await markAttendanceService(
        schoolId,
        teacherId,
        classId,
        subjectId,
        attendanceList
    );

    return reply.status(201).send({
        success: true,
        message: 'Attendance marked successfully ',
    });
};






