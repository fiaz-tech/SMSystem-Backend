import bcrypt from 'bcryptjs';
import type { PoolConnection } from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2/promise';
import { NotFoundError } from '../../utils/errors.js';

interface ScholNameRow extends RowDataPacket {
    name: string;
}

export const ROLE_CODE = {
    admin: 'AD',
    student: 'ST',
    teacher: 'TC',
    parent: 'PR',
} as const;

export const getSchoolInitials = (schoolName: string): string =>
    schoolName
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase();

export const generateUsername = (
    initials: string,
    roleCode: string,
    index: number
): string =>
    `${initials}/${roleCode}/${String(index).padStart(3, '0')}`;

export const hashDefaultPassword = async (username: string) =>
    bcrypt.hash(username, 10);


//GENERATE First time USERS BY ROLE + LIMIT
export const generateDefaultUsersByRole = async (
    schoolId: number,
    schoolName: string,
    role: 'student' | 'teacher' | 'parent',
    limit: number,
    conn: PoolConnection
) => {
    const roleCode = ROLE_CODE[role];
    const initials = getSchoolInitials(schoolName);

    // Find how many already exist
    const [rows]: any = await conn.query<any[]>(
        `SELECT COUNT(*) total FROM users
     WHERE school_id = ? AND role = ?`,
        [schoolId, role]
    );

    const startIndex = rows[0].total;
    const users: any[] = [];

    for (let i = startIndex + 1; i <= limit; i++) {
        const username = generateUsername(initials, roleCode, i);
        const password = await hashDefaultPassword(username);
        users.push([schoolId, username, password, role]);
    }

    if (users.length) {
        await conn.query(
            `INSERT INTO users (school_id, username, password, role)
       VALUES ?`,
            [users]
        );
    }
};


//GENERATE USERS BY ROLE + LIMIT
export const generateUsersByRole = async (
    schoolId: number,
    //schoolName: string,
    role: 'student' | 'teacher' | 'parent',
    limit: number,
    conn: PoolConnection
) => {
    const roleCode = ROLE_CODE[role];

    const [[row]] = await conn.query<ScholNameRow[]>(
        "SELECT name FROM schools WHERE id = ? LIMIT 1",
        [schoolId]
    );
    if (!row) {
        throw new NotFoundError("school not found");

    }
    const schoolName: string = row.name

    const initials = getSchoolInitials(schoolName);

    // Find how many already exist
    const [rows]: any = await conn.query<any[]>(
        `SELECT COUNT(*) total FROM users
         WHERE school_id = ? AND role = ?`,
        [schoolId, role]
    );

    const startIndex = rows[0].total;
    const users: any[] = [];

    for (let i = startIndex + 1; i <= limit; i++) {
        const username = generateUsername(initials, roleCode, i);
        const password = await hashDefaultPassword(username);
        users.push([schoolId, username, password, role]);
    }

    if (users.length) {
        await conn.query(
            `INSERT INTO users (school_id, username, password, role)
           VALUES ?`,
            [users]
        );
    }


};

