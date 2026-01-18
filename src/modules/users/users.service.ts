import type { PoolConnection } from 'mysql2/promise';
import db from '../../config/db.config.js';
import {
    ROLE_CODE,
    generateUsername,
    getSchoolInitials,
    hashDefaultPassword,
    generateDefaultUsersByRole,
    generateUsersByRole,

} from './users.utils.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';



//CREATE SCHOOL ADMIN 
export const createSchoolAdminUser = async (
    schoolId: number,
    schoolName: string,
    conn: PoolConnection
) => {
    const initials = getSchoolInitials(schoolName);
    const username = generateUsername(initials, ROLE_CODE.admin, 1);
    const password = await hashDefaultPassword(username);

    await conn.query(
        `INSERT INTO users (school_id, username, password, role)
     VALUES (?, ?, ?, 'admin')`,
        [schoolId, username, password]
    );

    return username;
};

// APPLY FREE TIER
export const applyFreeTier = async (
    schoolId: number,
    schoolName: string,
    conn: PoolConnection
) => {
    await generateDefaultUsersByRole(schoolId, schoolName, 'student', 20, conn);
    await generateDefaultUsersByRole(schoolId, schoolName, 'teacher', 5, conn);
    await generateDefaultUsersByRole(schoolId, schoolName, 'parent', 20, conn);
};


//Exapnd Users 
export const expandUsersAfterPaymentService = async (
    schoolId: number,
) => {

    const conn: PoolConnection = await db.getConnection();
    await conn.beginTransaction();

    //GET active subscription
    const [subs]: any = await conn.query(
        `
    SELECT sp.student_limit, sp.teacher_limit, sp.parent_limit
    FROM school_subscriptions ss
    JOIN subscription_plans sp ON ss.plan_id = sp.id
    WHERE ss.school_id = ? AND ss.status = 'active'
    LIMIT 1
    `,
        [schoolId]
    );

    if (!subs.length) {
        throw new BadRequestError('No active subscription found');
    }

    const { student_limit, teacher_limit, parent_limit } = subs[0];

    //Get SCHOOL NAME
    const [schools]: any = await conn.query(
        `SELECT name FROM schools WHERE id = ?`,
        [schoolId]
    );

    if (!schools.length) {
        throw new BadRequestError('School not found');
    }

    const schoolName = schools[0].name;


    await generateUsersByRole(
        schoolId,
        schoolName,
        'student',
        student_limit,
        conn
    );

    await generateUsersByRole(
        schoolId,
        schoolName,
        'teacher',
        teacher_limit,
        conn
    );

    await generateUsersByRole(
        schoolId,
        schoolName,
        'parent',
        parent_limit,
        conn
    );

    await conn.commit();
    conn.release();

    return true;
};





