import { Address } from "./addressRequest";
export interface UserWithAddresses {
    id: number;
    name: string;
    lastname: string;
    age: number;
    birthdate: string;
    email: string;
    phone: string;
    nickname: string;
    role_id: number;
    created_at: string;
    updated_at: string;
    address: Address[];
}
