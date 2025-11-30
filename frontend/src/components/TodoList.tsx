"use client";

import { useQuery } from "react-query";
import { fetchUserTasks } from "@/api/task";
import { useAuth } from "@/api/authContext";
import React from "react";
import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";
import {
    DndContext,
    DragOverlay,
    DragEndEvent,
} from "@dnd-kit/core";
import { DraggableTask } from "@/components/DnD/DraggableTask";
import { TaskCardUI } from "@/components/TodoTask";
import { useTaskMutations } from "@/hooks/useTaskMutations";
import { useTaskFiltering } from "@/hooks/useTaskFiltering";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useEditTask } from "@/hooks/useEditTask";
import { SearchBar } from "@/components/TodoList/SearchBar";
import { FilterButtons } from "@/components/TodoList/FilterButtons";
import { SortSelect } from "@/components/TodoList/SortSelect";
import { EditTaskDialog } from "@/components/TodoList/EditTaskDialog";
import { SuccessSnackbar } from "@/components/TodoList/SuccessSnackbar";
import { DragOverlayModal } from "@/components/TodoList/DragOverlayModal";

export default function TodoList() {
    const { user } = useAuth();

    const { data: tasks, isLoading, error } = useQuery(
        ["tasks", user?.id],
        () => fetchUserTasks(user!.id),
        { enabled: !!user }
    );

    const {
        deleteMutation,
        updateStatusMutation,
        updateTaskMutation,
        successMessage,
        successOpen,
        closeSuccessSnackbar,
    } = useTaskMutations(user?.id);

    const {
        search,
        statusFilter,
        sortBy,
        visibleTasks,
        setSearch,
        setStatusFilter,
        setSortBy,
    } = useTaskFiltering(tasks);

    const { activeDragTask, sensors, handleDragStart, handleDragEnd: handleDragEndHook } = useDragAndDrop(tasks);

    const {
        editingTask,
        editFormData,
        setEditFormData,
        handleEdit,
        handleCloseEdit,
        resetEditForm,
    } = useEditTask();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = handleDragEndHook(event);

        if (!over || !activeDragTask) return;

        let newStatus = "";
        if (over.id === "zone-todo") newStatus = "todo";
        if (over.id === "zone-in-progress") newStatus = "in-progress";
        if (over.id === "zone-done") newStatus = "done";

        if (newStatus && newStatus !== activeDragTask.status) {
            updateStatusMutation.mutate({ taskId: active.id as string, status: newStatus });
        }
    };

    const handleUpdateTask = () => {
        if (editingTask) {
            updateTaskMutation.mutate(
                {
                    taskId: String(editingTask.id),
                    data: editFormData,
                },
                {
                    onSuccess: () => {
                        resetEditForm();
                    },
                }
            );
        }
    };

    if (!user) return <Typography variant="h6">Log in, please, to see the tasks</Typography>;
    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Error during loading tasks</Typography>;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Box sx={{ maxWidth: 600, mx: "auto", p: 2, position: "relative" }}>
                <Box
                    sx={{
                        transition: "filter 0.3s ease",
                        filter: activeDragTask ? "blur(8px) grayscale(50%)" : "none",
                    }}
                >
                    <SearchBar value={search} onChange={setSearch} />

                    <FilterButtons value={statusFilter} onChange={setStatusFilter} />

                    <SortSelect value={sortBy} onChange={setSortBy} />

                    {visibleTasks.length ? (
                        visibleTasks.map((task) => (
                            <DraggableTask key={task.id} task={task}>
                                <TaskCardUI
                                    task={task}
                                    onDelete={(id: string) => deleteMutation.mutate(String(id))}
                                    onEdit={handleEdit}
                                    onStatusChange={(id: string, s: string) =>
                                        updateStatusMutation.mutate({ taskId: String(id), status: s })
                                    }
                                />
                            </DraggableTask>
                        ))
                    ) : (
                        <Typography variant="body1">No tasks</Typography>
                    )}
                </Box>

                {activeDragTask && <DragOverlayModal activeTask={activeDragTask} />}

                <DragOverlay>
                    {activeDragTask ? (
                        <Box sx={{ width: 250 }}>
                            <TaskCardUI task={activeDragTask} isOverlay />
                        </Box>
                    ) : null}
                </DragOverlay>

                <EditTaskDialog
                    open={!!editingTask}
                    formData={editFormData}
                    isLoading={updateTaskMutation.isLoading}
                    onClose={handleCloseEdit}
                    onSave={handleUpdateTask}
                    onFormDataChange={setEditFormData}
                />

                <SuccessSnackbar
                    open={successOpen}
                    message={successMessage}
                    onClose={closeSuccessSnackbar}
                />
            </Box>
        </DndContext>
    );
}
