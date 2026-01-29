import db from "../../config/db.config.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { NotFoundError } from "../../utils/errors.js";

export const assignTeacherToSubjectService = async ({
    subjectId,
    teacherId,
    schoolId,
    adminId
}: any) => {

    // Ensure subject belongs to school
    const [subject] = await db.query<RowDataPacket[]>(
        `SELECT id FROM subjects WHERE id = ? AND school_id = ?`,
        [subjectId, schoolId]
    );
    if (!subject.length) throw new NotFoundError('Subject not found');

    // Ensure user is a teacher
    const [teacher] = await db.query<RowDataPacket[]>(
        `SELECT id FROM users WHERE id = ? AND role = 'teacher' AND school_id = ?`,
        [teacherId, schoolId]
    );
    if (!teacher.length) throw new NotFoundError('Teacher not does not belong to school - Teacher not found');

    // Assign
    await db.query(
        `
    INSERT INTO teacher_subjects
    (school_id, subject_id, teacher_id, assigned_by)
    VALUES (?, ?, ?, ?)
    `,
        [schoolId, subjectId, teacherId, adminId]
    );
};


//UPDATE Teacher assignment
export const updateTeacherAssignmentService = async (
    assignmentId: number,
    schoolId: number,
    newTeacherId: number
) => {
    const [result] = await db.query<ResultSetHeader>(
        `
    UPDATE teacher_subjects
    SET teacher_id = ?
    WHERE id = ? AND school_id = ?
    `,
        [newTeacherId, assignmentId, schoolId]
    );

    if (!result.affectedRows)
        throw new NotFoundError('Assignment not found');

    return { message: 'Teacher reassigned successfully' };
};


//GET Subjects Assigned to a Teacher
export const getSubjectsByTeacherService = async (
    teacherId: number,
    schoolId: number
) => {
    const [rows] = await db.query(
        `
    SELECT s.*
    FROM teacher_subjects ts
    JOIN subjects s ON s.id = ts.subject_id
    WHERE ts.teacher_id = ?
      AND ts.school_id = ?
    `,
        [teacherId, schoolId]
    );

    if (!rows) {
        throw new NotFoundError("Could not retrieve subjects assigned subjects to teacher")
    }

    return rows;
};


//GET Teachers assigned to a Subject
export const getTeachersBySubjectService = async (
    subjectId: number,
    schoolId: number
) => {
    const [rows] = await db.query(
        `
    SELECT u.id, u.username
    FROM teacher_subjects ts
    JOIN users u ON u.id = ts.teacher_id
    WHERE ts.subject_id = ?
      AND ts.school_id = ?
    `,
        [subjectId, schoolId]
    );

    if (!rows) {
        throw new NotFoundError("Could not retrieve Teachers assigned to the subject")
    }

    return rows;
};

