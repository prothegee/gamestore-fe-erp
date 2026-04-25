import type { RbacRole } from "./common";

export interface User {
    id: string;
    username: string;
    email: string;
    role: RbacRole;
    avatarUrl?: string;
    createdAt: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthSession {
    token: string;
    user: User;
    expiresAt: string;
}
