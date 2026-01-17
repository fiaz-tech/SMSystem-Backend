import type { RowDataPacket } from 'mysql2';

export interface School extends RowDataPacket {
    id: number;
    name: string;
    slug: string;
    email: string;
    phone: string | null;
    status: 'active' | 'inactive';
    logo_url: string | null;
    created_at: Date;
}
