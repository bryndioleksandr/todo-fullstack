import { Task, TaskStatus, SortOption, StatusFilter } from "@/types/task";

export const getStatusColor = (status: TaskStatus | string): "success" | "warning" | "default" => {
    switch (status) {
        case "done":
            return "success";
        case "in-progress":
            return "warning";
        case "todo":
            return "default";
        default:
            return "default";
    }
};

export const filterTasksBySearch = (tasks: Task[] | undefined, search: string): Task[] => {
    if (!tasks) return [];
    if (!search.trim()) return tasks;

    const searchLower = search.toLowerCase();
    return tasks.filter((task) =>
        task.title.toLowerCase().includes(searchLower)
    );
};

export const filterTasksByStatus = (tasks: Task[], statusFilter: StatusFilter): Task[] => {
    if (statusFilter === "all") return tasks;
    return tasks.filter((task) => task.status === statusFilter);
};

export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
    const sorted = [...tasks];

    if (sortBy === "priority-desc") {
        return sorted.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }

    if (sortBy === "priority-asc") {
        return sorted.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    }

    return sorted.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
};

export const processTasks = (
    tasks: Task[] | undefined,
    search: string,
    statusFilter: StatusFilter,
    sortBy: SortOption
): Task[] => {
    const filteredBySearch = filterTasksBySearch(tasks, search);
    const filteredByStatus = filterTasksByStatus(filteredBySearch, statusFilter);
    return sortTasks(filteredByStatus, sortBy);
};

