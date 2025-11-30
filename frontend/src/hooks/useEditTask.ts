import { useState } from "react";
import { Task, EditFormData } from "@/types/task";

export const useEditTask = () => {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editFormData, setEditFormData] = useState<EditFormData>({
        title: "",
        description: "",
        priority: 1,
    });

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setEditFormData({
            title: task.title,
            description: task.description,
            priority: task.priority,
        });
    };

    const handleCloseEdit = () => {
        setEditingTask(null);
        setEditFormData({ title: "", description: "", priority: 1 });
    };

    const resetEditForm = () => {
        setEditingTask(null);
        setEditFormData({ title: "", description: "", priority: 1 });
    };

    return {
        editingTask,
        editFormData,
        setEditFormData,
        handleEdit,
        handleCloseEdit,
        resetEditForm,
    };
};

