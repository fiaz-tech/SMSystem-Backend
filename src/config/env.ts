import 'dotenv/config';



function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    DB_HOST: requiredEnv("DB_HOST"),
    DB_USER: requiredEnv("DB_USER"),
    DB_NAME: requiredEnv("DB_NAME"),
    DB_PASSWORD: process.env.DB_PASSWORD ?? "",
};
