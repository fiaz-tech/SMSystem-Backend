import db from "../../config/db.config.js";
import type { RowDataPacket } from "mysql2";
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
