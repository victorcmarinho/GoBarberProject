export interface UserInterface {
    name: string,
    email: string,
    password_hash: string,
    provider?: boolean,
    created_at?: Date
    updated_at?: Date
}
