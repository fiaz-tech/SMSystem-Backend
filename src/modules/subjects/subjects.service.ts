import db from "../../config/db.config.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { NotFoundError } from "../../utils/errors.js";

export const createSubjectService = async (subjectData: any) => {
    const {
        name,
        code,
        schoolId,
        adminId
    } = subjectData
    const [result]: any = await db.query(
        `INSERT INTO subjects (name, code, school_id, created_by)
            VALUES (?, ?, ?, ?)
 `,
        [name, code, schoolId, adminId]
    );

    return {
        id: result.insertId,
        name,
        code
    };
};


export const getSchoolSubjectsService = async (id: number) => {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM subjects WHERE school_id = ?',
        [id]
    );

    if (!rows.length) {
        throw new NotFoundError('School subjects not found')
    }
    return rows;

}


//GET a single Subject BY ID by School
export const getSubjectByIdService = async (
    subjectId: number,
    schoolId: number
) => {
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT * FROM subjects WHERE id = ? AND school_id = ?`,
        [subjectId, schoolId]
    );

    if (!rows.length) throw new NotFoundError('Subject not found');
    return rows[0];
};


// UPDATE SUBJECTS 
export const updateSubjectService = async (
    subjectId: number,
    schoolId: number,
    payload: { name?: string; code?: string }
) => {
    const [result] = await db.query<ResultSetHeader>(
        `
    UPDATE subjects
    SET name = COALESCE(?, name),
        code = COALESCE(?, code)
    WHERE id = ? AND school_id = ?
    `,
        [payload.name, payload.code, subjectId, schoolId]
    );

    if (!result.affectedRows)
        throw new NotFoundError('Subject not found');

    return { message: 'Subject updated successfully' };
};


//DELETE Subject
export const deleteSubjectService = async (
    subjectId: number,
    schoolId: number
) => {
    const [result] = await db.query<ResultSetHeader>(
        `DELETE FROM subjects WHERE id = ? AND school_id = ?`,
        [subjectId, schoolId]
    );

    if (!result.affectedRows)
        throw new NotFoundError('Subject not found');

    return { message: 'Subject deleted' };
};





