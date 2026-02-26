import { z } from "zod";

const toTitleCase = (str: string) => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const registerSchoolSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "School name must be at least 3 characters")
        .max(100, "School name too long")
        .transform((val) => toTitleCase(val)),


    email: z
        .email("Invalid email address"),

    phone: z
        .string(),

    address: z
        .string()
        .min(5, "Address too short"),

    logo_url: z.string()
});

export type RegisterSchoolBody = z.infer<typeof registerSchoolSchema>;

