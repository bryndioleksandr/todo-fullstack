import { useMutation, useQueryClient } from "react-query";
import { deleteTask, updateTask } from "@/api/task";
import { useState } from "react";
import { Task } from "@/types/task";

export const useTaskMutations = (userId: string | undefined) => {
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [successOpen, setSuccessOpen] = useState(false);

    const deleteMutation = useMutation(
        (taskId: string) => deleteTask(taskId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["tasks"]);
                setSuccessMessage("Task is deleted successfully!");
                setSuccessOpen(true);
            },
        }
    );

    const updateStatusMutation = useMutation(
        ({ taskId, status }: { taskId: string; status: string }) =>
            updateTask(taskId, { status }),
        {
            onMutate: async ({ taskId, status }) => {
                await queryClient.cancelQueries(["tasks", userId]);

                const previousTasks = queryClient.getQueryData(["tasks", userId]);

                queryClient.setQueryData(["tasks", userId], (old: any) => {
                    if (!old) return old;
                    return old.map((task: Task) =>
                        String(task.id) === String(taskId) ? { ...task, status } : task
                    );
                });

                return { previousTasks };
            },
            onError: (err, variables, context) => {
                if (context?.previousTasks) {
                    queryClient.setQueryData(["tasks", userId], context.previousTasks);
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["tasks", userId]);
                setSuccessMessage("Status is updated!");
                setSuccessOpen(true);
            },
        }
    );

    const updateTaskMutation = useMutation(
        ({ taskId, data }: { taskId: string; data: any }) =>
            updateTask(taskId, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["tasks"]);
                setSuccessMessage("Task is updated successfully!");
                setSuccessOpen(true);
            },
        }
    );

    const closeSuccessSnackbar = () => setSuccessOpen(false);

    return {
        deleteMutation,
        updateStatusMutation,
        updateTaskMutation,
        successMessage,
        successOpen,
        closeSuccessSnackbar,
    };
};

