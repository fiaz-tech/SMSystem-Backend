import db from "../../config/db.config.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { NotFoundError } from "../../utils/errors.js";


//Create classroom service
export const createClassService = async (schoolId: number, name: string) => {
    const [result]: any = await db.query(
        `INSERT INTO classes (school_id, name) VALUES (?, ?)`,
        [schoolId, name]
    );
    return {
        id: result.insertId,
        name
    };
};

//GET all classes in a school By School Admin
export const getClassesService = async (schoolId: number) => {

    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT * FROM classes WHERE school_id = ?`,
        [schoolId]
    );
    if (!rows.length) {
        throw new NotFoundError("Unable to retrieve classes")
    }
    return rows;
};


//UPDATE Class name
export const updateClassService = async (
    classId: number,
    schoolId: number,
    name: string
) => {

    const [result] = await db.query<ResultSetHeader>(
        `UPDATE classes SET name = ? WHERE id = ? AND school_id = ?`,
        [name, classId, schoolId]
    );
    if (!result.affectedRows) throw new NotFoundError('Class not found');

    return result;
};

export const deleteClassService = async (classId: number, schoolId: number) => {
    await db.query(
        `DELETE FROM classes WHERE id = ? AND school_id = ?`,
        [classId, schoolId]
    );
};



