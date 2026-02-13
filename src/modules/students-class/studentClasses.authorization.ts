import db from "../../config/db.config.js";
import type { RowDataPacket } from "mysql2";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";



//Ensure Class belongs to School
export const isSchoolClass = async (
    classId: number,
    schoolId: number,
) => {
    const [schoolClass] = await db.query<RowDataPacket[]>(
        `SELECT id FROM classes WHERE id = ? AND school_id = ?`,
        [classId, schoolId]
    );
    if (!schoolClass.length) throw new NotFoundError('class not found in the school');

}


//Ensure student belongs to School
export const isSchoolStudent = async (
    studentId: number,
    schoolId: number,
) => {
    const [schoolStudent] = await db.query<RowDataPacket[]>(
        `SELECT id FROM users WHERE id = ? AND school_id = ?`,
        [studentId, schoolId]
    );
    if (!schoolStudent.length)
        throw new NotFoundError('student not found in the school');


}






