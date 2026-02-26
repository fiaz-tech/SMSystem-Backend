import type { PoolConnection, RowDataPacket } from "mysql2/promise";

interface CodeRow extends RowDataPacket {
    school_code: string;
}

export const getSchoolInitials = (schoolName: string): string =>
    schoolName
        .trim()
        .split(/\s+/)
        .map(word => word[0])
        .join("")
        .toUpperCase();

export const generateUniqueSchoolCode = async (
    schoolName: string,
    conn: PoolConnection
): Promise<string> => {
    const baseInitials = getSchoolInitials(schoolName);

    // Find existing codes that start with the same initials
    const [rows] = await conn.query<CodeRow[]>(
        `SELECT school_code FROM schools
     WHERE school_code LIKE ?`,
        [`${baseInitials}%`]
    );

    if (rows.length === 0) {
        return baseInitials;
    }

    // Extract numeric suffixes
    const existingNumbers = rows
        .map(row => row.school_code.replace(baseInitials, ""))
        .map(suffix => Number(suffix))
        .filter(n => !isNaN(n));

    const nextNumber =
        existingNumbers.length > 0
            ? Math.max(...existingNumbers) + 1
            : 1;

    return `${baseInitials}${nextNumber}`;
};
