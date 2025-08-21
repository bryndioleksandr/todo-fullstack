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
    console.log('task id front is:', taskId);
    const res = await api.put(`/task/tasks/${taskId}`, task);
    return res.data;
}

export const deleteTask = async (taskId: string) => {
    console.log('task id front delete:', taskId);
    const res = await api.delete(`/task/tasks/${taskId}`);
    return res.data;
}

export const fetchUserTasks = async (userId: string) => {
    const res = await api.get(`/task/user-tasks/${userId}`);
    return res.data;
}
