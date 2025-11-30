export interface Task {
    id: string | number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: number;
    createdAt?: string;
    userId?: string;
}

export type TaskStatus = "todo" | "in-progress" | "done";

export type StatusFilter = "all" | TaskStatus;

export type SortOption = "newest" | "priority-desc" | "priority-asc" | "";

export interface EditFormData {
    title: string;
    description: string;
    priority: number;
}

export interface User {
    id: string;
    username: string;
}

