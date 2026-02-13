import db from "../../config/db.config.js";
import type { RowDataPacket } from "mysql2";
import { NotFoundError } from "../../utils/errors.js";


//Assign Subects to class service
export const assignSubjectToClassService = async (
    schoolId: number,
    classId: number,
    subjectId: number
) => {
    // Ensure subject belongs to school
    const [subject] = await db.query<RowDataPacket[]>(
        `SELECT id FROM subjects WHERE id = ? AND school_id = ?`,
        [subjectId, schoolId]
    );
    if (!subject.length) throw new NotFoundError('Subject not found');

    //Ensure Class belongs to School
    const [schoolClass] = await db.query<RowDataPacket[]>(
        `SELECT id FROM classes WHERE id = ? AND school_id = ?`,
        [classId, schoolId]
    );
    if (!schoolClass.length) throw new NotFoundError('class not found');


    await db.query(
        `
    INSERT INTO class_subjects (school_id, class_id, subject_id)
    VALUES (?, ?, ?)
    `,
        [schoolId, classId, subjectId]
    );
};


//Get Subjects for a class
export const getSubjectsByClassService = async (
    classId: number,
    schoolId: number
) => {
    const [rows] = await db.query<RowDataPacket[]>(
        `
    SELECT s.*
    FROM class_subjects cs
    JOIN subjects s ON s.id = cs.subject_id
    WHERE cs.class_id = ? AND cs.school_id = ?
    `,
        [classId, schoolId]
    );

    //REMove this condition later, instead add funct to check if class belongs to school before getting
    if (!rows.length) {
        throw new NotFoundError("No subject added to school yet")
    }
    return rows;
};


//Remove Subject from Class
export const removeSubjectFromClassService = async (
    classSubjectId: number,
    schoolId: number
) => {
    await db.query(
        `DELETE FROM class_subjects WHERE id = ? AND school_id = ?`,
        [classSubjectId, schoolId]
    );
};


