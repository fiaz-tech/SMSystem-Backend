export function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')   // remove special chars
        .replace(/\s+/g, '-')       // spaces → hyphens
        .replace(/-+/g, '-');       // collapse multiple hyphens
}
