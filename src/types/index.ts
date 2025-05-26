export type UserRole = 'admin' | 'manager' | 'user';

export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    name: string;
    photoURL?: string;
    role: UserRole;
    projects: string[]; // Array of project IDs
} 