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
    /*schoolName: string,*/
    limits: {
        student: number;
        teacher: number;
        parent: number;
    }
) => {
    if (!schoolId) {
        throw new BadRequestError('Invalid school data');
    }

    if (
        limits.student < 0 ||
        limits.teacher < 0 ||
        limits.parent < 0
    ) {
        throw new BadRequestError('Invalid subscription limits');
    }

    const conn: PoolConnection = await db.getConnection();
    await conn.beginTransaction();

    await generateUsersByRole(
        schoolId,
        'student',
        limits.student,
        conn
    );

    await generateUsersByRole(
        schoolId,
        'teacher',
        limits.teacher,
        conn
    );

    await generateUsersByRole(
        schoolId,
        'parent',
        limits.parent,
        conn
    );

    await conn.commit();
    conn.release();

    return true;
};





