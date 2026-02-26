import db from "../../config/db.config.js";
import type { RowDataPacket } from "mysql2";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { autoAssignSubjectsToStudent } from "../student_subjects/studentSubjects.service.js";
import { isSchoolClass, isSchoolStudent } from "./studentClasses.authorization.js";



// Assign student to class service
export const assignStudentToClassService = async (
    schoolId: number,
    classId: number,
    studentId: number
) => {

    //Ensure Class belongs to School
    const [schoolClass] = await db.query<RowDataPacket[]>(
        `SELECT id FROM classes WHERE id = ? AND school_id = ?`,
        [classId, schoolId]
    );
    if (!schoolClass.length) throw new NotFoundError('class not found in the school');


    //Ensure student belongs to School
    const [schoolStudent] = await db.query<RowDataPacket[]>(
        `SELECT id FROM users WHERE id = ? AND school_id = ?`,
        [studentId, schoolId]
    );
    if (!schoolStudent.length) throw new NotFoundError('student not found in the school');


    //Check Number of Students in School
    const [[count]] = await db.query<RowDataPacket[]>(
        `
    SELECT COUNT(*) AS total
    FROM student_classes
    WHERE school_id = ?
    `,
        [schoolId]
    );


    if (!count) {
        throw new NotFoundError("No data found");
    }

    //Check School Subscription
    const [[limit]] = await db.query<RowDataPacket[]>(
        `
    SELECT sp.student_limit
    FROM school_subscriptions ss
    JOIN subscription_plans sp ON sp.id = ss.plan_id
    WHERE ss.school_id = ? AND ss.status = 'active'
    `,
        [schoolId]
    );


    if (!limit) {
        throw new NotFoundError("This is beyond limit")
    }

    if (count.total >= limit.student_limit)
        throw new ForbiddenError('Student limit reached');

    await db.query(
        `
    INSERT INTO student_classes (school_id, student_id, class_id)
    VALUES (?, ?, ?)
    `,
        [schoolId, studentId, classId]
    );

    await db.query(
        `UPDATE users SET is_assigned = true WHERE id = ?`,
        [studentId]
    );
};


//GET students in a Class service
export const getStudentsByClassService = async (
    classId: number,
    schoolId: number
) => {

    //Ensure Class belongs to School
    const [schoolClass] = await db.query<RowDataPacket[]>(
        `SELECT id FROM classes WHERE id = ? AND school_id = ?`,
        [classId, schoolId]
    );
    if (!schoolClass.length) throw new NotFoundError('class not found in the school');


    const [rows] = await db.query<RowDataPacket[]>(
        `
    SELECT u.id, u.username, u.first_name
    FROM student_classes sc
    JOIN users u ON u.id = sc.student_id
    WHERE sc.class_id = ? AND sc.school_id = ?
    `,
        [classId, schoolId]
    );
    return rows;
};


//Move Student to another Class controller
export const updateStudentClassService = async (
    studentId: number,
    classId: number,
    schoolId: number
) => {
    //Ensure Class belongs to School
    const [schoolClass] = await db.query<RowDataPacket[]>(
        `SELECT id FROM classes WHERE id = ? AND school_id = ?`,
        [classId, schoolId]
    );
    if (!schoolClass.length) throw new NotFoundError('class not found in the school');

    //Ensure student belongs to School
    const [schoolStudent] = await db.query<RowDataPacket[]>(
        `SELECT id FROM users WHERE id = ? AND school_id = ?`,
        [studentId, schoolId]
    );
    if (!schoolStudent.length) throw new NotFoundError('student not found in the school');

    await db.query(
        `
    UPDATE student_classes
    SET class_id = ?
    WHERE student_id = ? AND school_id = ?
    `,
        [classId, studentId, schoolId]
    );
};

export const removeStudentFromClassService = async (
    studentId: number,
    schoolId: number
) => {
    await db.query(
        `DELETE FROM student_classes WHERE student_id = ? AND school_id = ?`,
        [studentId, schoolId]
    );

    await db.query(
        `UPDATE users SET is_assigned = false WHERE id = ?`,
        [studentId]
    );
};



