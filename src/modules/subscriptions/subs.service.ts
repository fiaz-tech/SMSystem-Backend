import type { PoolConnection } from 'mysql2/promise';
import db from '../../config/db.config.js';
import { BadRequestError } from '../../utils/errors.js';


export const createFreeTierSchoolSubscription = async (
    schoolId: number,
    conn: PoolConnection
) => {
    const planId = 1;
    const schoolStatus = "active";
    await conn.query(
        `INSERT INTO school_subscriptions(school_id, plan_id,status)
        VALUES (?, ?, ?)`,
        [schoolId, planId, schoolStatus]
    );
    return planId;
}


export const updateSchoolSubscriptionService = async (
    schoolId: number,
    planId: number,
    status: 'pending' | 'active' | 'expired'
) => {
    if (!schoolId || !planId) {
        throw new BadRequestError('Invalid subscription data');
    }

    const [result]: any = await db.query(
        `
    UPDATE school_subscriptions
    SET plan_id = ?, status = ?, starts_at = NOW()
    WHERE school_id = ?
    `,
        [planId, status, schoolId]
    );

    if (result.affectedRows === 0) {
        throw new BadRequestError('Subscription not found');
    }

    return true;
};

