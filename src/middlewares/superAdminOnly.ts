import { ForbiddenError } from "../utils/errors.js";

export const superAdminOnly = async (request: any) => {
    if (request.user.role !== 'super_admin') {
        throw new ForbiddenError('Super admin access only');
    }
};
