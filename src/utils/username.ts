/**
 * Default password equals the username
 * User will be forced to change it on first login
 */
export const generateDefaultPassword = (username: string): string => {
    return username;
};
