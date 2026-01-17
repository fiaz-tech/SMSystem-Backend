import db from "../../config/db.config.js";
import type { RowDataPacket } from "mysql2";
import { slugify } from "../../utils/slugify.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import type { School } from "./schools.types.js";
import { createSchoolAdminUser, applyFreeTier } from "../users/users.service.js";


interface CountRow extends RowDataPacket {
    total: number;
}``


export const createSchoolWithDefaults = async (data: any) => {
    const {
        name,
        address,
        email,
        phone,
        logo_url,
        status = 'active'
    } = data;

    const slug = slugify(name);
    const connection = await db.getConnection();
    await connection.beginTransaction();


    //Ensure slug is unique - slug check
    const [slugRows] = await connection.query(
        'SELECT id FROM schools WHERE slug = ?',
        [slug]
    );
    if ((slugRows as any[]).length > 0) {
        throw new BadRequestError('A school with this name already exists');
    }

    // Create School
    const [schoolResult]: any = await connection.query(
        `INSERT INTO schools ( name, address, slug, email, phone, logo_url)
      VALUES (?, ?, ?, ?, ?, ?)`,
        [name, address, slug, email, phone, logo_url]
    );

    const schoolId = schoolResult.insertId

    // Create admin user
    await createSchoolAdminUser(schoolId, data.name, connection);

    // Apply free tier
    await applyFreeTier(schoolId, data.name, connection);

    await connection.commit();
    connection.release();

    return { schoolId };
};



export const getSchoolBySlugService = async (slug: string) => {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM schools WHERE slug = ? AND status = "active"',
        [slug]
    );
    if (!rows.length) {
        throw new NotFoundError('School not found');
    }
    return rows[0];
};

export const getSchoolByIdService = async (id: number) => {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM schools WHERE id = ?',
        [id]
    );

    if (!rows.length) {
        throw new NotFoundError('School not found');
    }

    return rows[0];
};

//GET ALL SCHOOLS
export const getAllSchoolsService = async (
    page: number,
    limit: number
) => {
    const offset = (page - 1) * limit;

    // Get paginated schools
    const [rows] = await db.query<School[]>(
        `SELECT id, name, slug, email, phone, status, logo_url, created_at
     FROM schools
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    // Get total count
    const [countRows] = await db.query<CountRow[]>(
        'SELECT COUNT(*) AS total FROM schools'
    );

    const [{ total } = { total: 0 }] = countRows;

    //const total = countRows.length ? countRows[0].total : 0;
    //const total = countRows[0].total as number;


    return {
        data: rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};


export const updateSchoolBySlugService = async (
    slug: string,
    updates: any
) => {
    const [result] = await db.query(
        'UPDATE schools SET ? WHERE slug = ?',
        [updates, slug]
    );

    if ((result as any).affectedRows === 0) {
        throw new NotFoundError('School not found');
    }
};

export const deleteSchoolBySlugService = async (slug: string) => {
    const [result] = await db.query(
        'UPDATE schools SET status = "inactive" WHERE slug = ?',
        [slug]
    );

    if ((result as any).affectedRows === 0) {
        throw new NotFoundError('School not found');
    }
};