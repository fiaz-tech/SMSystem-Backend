import db from '../../config/db.config.js';
import { BadRequestError } from '../../utils/errors.js';



export const validateUserLoginLimit = async (
    schoolId: number,
    role: 'student' | 'teacher' | 'parent'
) => {
    // Get active subscription limits
    const [subs]: any = await db.query(
        `
    SELECT sp.student_limit, sp.teacher_limit, sp.parent_limit
    FROM school_subscriptions ss
    JOIN school_plans sp ON ss.plan_id = sp.id
    WHERE ss.school_id = ? AND ss.status = 'active'
    LIMIT 1
    `,
        [schoolId]
    );

    if (!subs.length) {
        throw new BadRequestError('No active subscription');
    }

    const limits = subs[0];

    const limit =
        role === 'student'
            ? limits.student_limit
            : role === 'teacher'
                ? limits.teacher_limit
                : limits.parent_limit;

    // 2️⃣ Count active users
    const [count]: any = await db.query(
        `
    SELECT COUNT(*) total
    FROM users
    WHERE school_id = ? AND role = ? AND status = 'active'
    `,
        [schoolId, role]
    );

    if (count[0].total > limit) {
        throw new BadRequestError(
            `Login blocked: ${role} limit exceeded`
        );
    }

    return true;
};
