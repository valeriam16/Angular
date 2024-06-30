export interface User {
    id: number;
    name: string;
    lastname: string;
    age: number;
    birthdate: string;
    email: string;
    phone: string;
    nickname: string;
    role_id: number;
    remember_me_token: string | null;
    created_at: string;
    updated_at: string;
}