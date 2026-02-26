import db from "../../config/db.config.js";
import type { RowDataPacket } from "mysql2";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";


export const autoAssignSubjectsToStudent = async (
    schoolId: number,
    studentId: number,
    classId: number
) => {

    const [subjects]: any = await db.query(
        `
    SELECT subject_id, is_compulsory
    FROM class_subjects
    WHERE class_id = ?
    `,
        [classId]
    );

    for (const sub of subjects) {

        await db.query(
            `
      INSERT IGNORE INTO student_subjects
      (school_id, student_id, subject_id, class_id, status)
      VALUES (?, ?, ?, ?, ?)
      `,
            [
                schoolId,
                studentId,
                sub.subject_id,
                classId,
                sub.is_compulsory ? 'compulsory' : 'pending'
            ]
        );
    }
};


//GET a Student's Subject  List
export const getStudentSubjectsService = async (
    studentId: number
) => {

    const [rows] = await db.query(
        `
    SELECT s.name, ss.status
    FROM student_subjects ss
    JOIN subjects s ON s.id = ss.subject_id
    WHERE ss.student_id = ?
    `,
        [studentId]
    );

    return rows;
};



//Stuent pick or drop subjects that are not compulsory
export const respondToSubjectService = async (
    studentId: number,
    subjectId: number,
    action: 'accepted' | 'rejected'
) => {

    const [[subject]]: any = await db.query(
        `
    SELECT status FROM student_subjects
    WHERE student_id = ? AND subject_id = ?
    `,
        [studentId, subjectId]
    );

    if (subject.status === 'compulsory')
        throw new ForbiddenError('Compulsory subject cannot be rejected');

    await db.query(
        `
    UPDATE student_subjects
    SET status = ?
    WHERE student_id = ? AND subject_id = ?
    `,
        [action, studentId, subjectId]
    );
};


