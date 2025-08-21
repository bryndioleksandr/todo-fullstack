import api from './axios';

export const fetchTasks = async () => {
    const res = await api.get("task/tasks");
    return res.data;
}

export const fetchTasksByStatus = async (statuses: string | string []) => {
    const statusParam = Array.isArray(statuses) ? statuses.join(",") : statuses;
    const res = await api.get(`/task/tasks-by-status?status=${statusParam}`);
    return res.data;
}

export const createTask = async (userId: string, title: string, description: string, status?: string) => {
    const res = await api.post("task/task", {userId, title, description, status});
    return res.data;
}

export const fetchTaskById = async (taskId: string): Promise<void> => {
    const res = await api.get(`/task/${taskId}`);
    return res.data;
}

export const updateTask = async (taskId: string, task: {title?: string; description?: string; status?: string})=> {
    const res = await api.put(`/task/${taskId}`, task);
    return res.data;
}

export const deleteTask = async (taskId: string) => {
    const res = await api.delete(`/task/${taskId}`);
    return res.data;
}

//user-tasks/:userId

export const fetchUserTasks = async (userId: string) => {
    const res = await api.get(`/task/user-tasks/${userId}`);
    return res.data;
}
