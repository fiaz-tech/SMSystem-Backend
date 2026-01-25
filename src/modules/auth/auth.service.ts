import db from '../../config/db.config.js';
import { hashPassword } from '../../utils/password.js';
import { BadRequestError, ForbiddenError } from '../../utils/errors.js';
import { comparePassword } from '../../utils/password.js';
import { signToken } from '../../utils/jwt.js';


export const loginService = async (
    username: string,
    password: string
) => {
    const [users]: any = await db.query(
        `SELECT * FROM users WHERE username = ? AND status = 'active' LIMIT 1`,
        [username]
    );

    if (!users.length) {
        throw new BadRequestError('Invalid credentials');
    }


    const user = users[0];

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
        throw new BadRequestError('Invalid credentials');
    }

    const token = signToken({
        id: user.id,
        role: user.role,
        schoolId: user.school_id,
        mustChangePassword: user.must_change_password
    });

    if (user.must_change_password == true) {
        return { mustChangePassword: "HEY USER you need to change your password" }
    }

    return {
        token,
        mustChangePassword: user.must_change_password,
        user: {
            id: user.id,
            role: user.role,
            schoolId: user.school_id
        }
    };
};


//Update password
export const updatePasswordService = async (
    userId: number,
    newPassword: string
) => {
    if (newPassword.length < 8) {
        throw new ForbiddenError('Password too short');
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.query(
        `
    UPDATE users
    SET password = ?, must_change_password = false,
    password_changed_at = NOW()
    WHERE id = ?
    `,
        [hashedPassword, userId]
    );
};


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
