"use client";

import {useMutation, useQuery, useQueryClient} from "react-query";
import {deleteTask, fetchUserTasks, updateTask} from "@/api/task";
import React, {SetStateAction, useEffect, useState} from "react";
import {
    Card,
    CardContent,
    Typography,
    Chip,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    Box,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, MenuItem, Slider, Paper,
} from "@mui/material";
import {Assignment, AssignmentTurnedIn, Delete, Edit, PendingActions} from "@mui/icons-material";
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent
} from '@dnd-kit/core';
import {DraggableTask} from "@/components/DnD/DraggableTask";
import {DroppableZone} from "@/components/DnD/DroppableZone";
import {TaskCardUI} from "@/components/TodoTask";

interface EditFormData {
    title: string;
    description: string;
    priority: number;
}


export default function TodoList() {
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "in-progress" | "done">("all");
    const [editingTask, setEditingTask] = useState<any>(null);
    const [editFormData, setEditFormData] = useState<EditFormData>({title: "", description: "", priority: 1});
    const [successOpen, setSuccessOpen] = useState(false);
    const [sortBy, setSortBy] = useState("");

    const [activeDragTask, setActiveDragTask] = useState<any>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {activationConstraint: {distance: 5}}),
        useSensor(TouchSensor, {activationConstraint: {delay: 50, tolerance: 5}})
    );

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleStorage = () => {
            const updatedUser = localStorage.getItem("user");
            setUser(updatedUser ? JSON.parse(updatedUser) : null);
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const {data: tasks, isLoading, error, refetch} = useQuery(
        ["tasks", user?.id],
        () => fetchUserTasks(user!.id),
        {enabled: !!user}
    );

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
        ({taskId, status}: { taskId: string; status: string }) =>
            updateTask(taskId, {status}),
        {
            onMutate: async ({taskId, status}) => {
                await queryClient.cancelQueries(["tasks", user?.id]);

                const previousTasks = queryClient.getQueryData(["tasks", user?.id]);

                queryClient.setQueryData(["tasks", user?.id], (old: any) => {
                    if (!old) return old;
                    return old.map((task: any) =>
                        String(task.id) === String(taskId) ? {...task, status} : task
                    );
                });

                return {previousTasks};
            },
            onError: (err, variables, context) => {
                if (context?.previousTasks) {
                    queryClient.setQueryData(["tasks", user?.id], context.previousTasks);
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["tasks", user?.id]);
                setSuccessMessage("Status is updated!");
                setSuccessOpen(true);
            },
        }
    );

    const updateTaskMutation = useMutation(
        ({taskId, data}: { taskId: string; data: any }) =>
            updateTask(taskId, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["tasks"]);
                setSuccessMessage("Task is updated successfully!");
                setSuccessOpen(true);
                setEditingTask(null);
                setEditFormData({title: "", description: "", priority: 1});
            },
        }
    );

    useEffect(() => {
        if (user) {
            refetch();
        }
    }, [user, refetch]);

    const handleDelete = (taskId: string) => {
        deleteMutation.mutate(taskId);
    };

    const handleStatusChange = (taskId: string, newStatus: string) => {
        updateStatusMutation.mutate({taskId, status: newStatus});
    };

    const handleEdit = (task: any) => {
        setEditingTask(task);
        setEditFormData({
            title: task.title,
            description: task.description,
            priority: task.priority,
        });
    };

    const handleUpdateTask = () => {
        if (editingTask) {
            updateTaskMutation.mutate({
                taskId: editingTask.id,
                data: editFormData
            });
        }
    };

    const handleCloseEdit = () => {
        setEditingTask(null);
        setEditFormData({title: "", description: "", priority: 1});
    };

    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;
        const task = tasks?.find((t: any) => t.id.toString() === active.id);
        setActiveDragTask(task);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        setActiveDragTask(null);

        if (!over) return;

        let newStatus = "";
        if (over.id === 'zone-todo') newStatus = 'todo';
        if (over.id === 'zone-in-progress') newStatus = 'in-progress';
        if (over.id === 'zone-done') newStatus = 'done';

        if (newStatus && newStatus !== activeDragTask?.status) {
            updateStatusMutation.mutate({taskId: active.id as string, status: newStatus});
        }
    };

    if (!user) return <Typography variant="h6">Log in, please, to see the tasks</Typography>;
    if (isLoading) return <CircularProgress/>;
    if (error) return <Typography color="error">Error during loading tasks</Typography>;

    const filteredTasks = tasks?.filter((task: any) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    );

    const visibleTasks = filteredTasks?.filter((task: any) =>
        statusFilter === "all" ? true : task.status === statusFilter
    )?.sort((a: any, b: any) => {
        if (sortBy === "priority-desc") {
            return (b.priority || 0) - (a.priority || 0);
        }

        if (sortBy === "priority-asc") {
            return (a.priority || 0) - (b.priority || 0);
        }

        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return (b.id || 0) - (a.id || 0);
    });

    const getStatusColor = (status: string) => {
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

    const handleChangePriority = (_: Event, newValue: number) => {
        setEditFormData(prev => ({...prev, priority: newValue}));
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Box sx={{maxWidth: 600, mx: "auto", p: 2, position:'relative'}}>
                <Box sx={{
                    transition: 'filter 0.3s ease',
                    filter: activeDragTask ? 'blur(8px) grayscale(50%)' : 'none',
                }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    color="primary"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        mb: 2,
                        "& .MuiInputBase-input": {
                            color: "#1976d2",
                        },
                        "& .MuiInputLabel-root": {
                            color: "#1565c0",
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#1976d2",
                            },
                            "&:hover fieldset": {
                                borderColor: "#1565c0",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#0d47a1",
                            },
                        },
                    }}
                />

                <ToggleButtonGroup
                    value={statusFilter}
                    exclusive
                    onChange={(_, newStatus) => {
                        if (newStatus !== null) setStatusFilter(newStatus);
                    }}
                    sx={{
                        mb: 3,
                        display: "flex",
                        justifyContent: "center",
                        "& .MuiToggleButton-root": {
                            color: "#1976d2",
                            border: "1px solid #1976d2",
                            borderRadius: "8px",
                            mx: 0.5,
                            "&.Mui-selected": {
                                backgroundColor: "#1976d2",
                                color: "#fff",
                                borderColor: "#1976d2",
                            },
                            "&.Mui-selected:hover": {
                                backgroundColor: "#1565c0",
                            },
                            "&:hover": {
                                backgroundColor: "#e3f2fd",
                            },
                        },
                    }}
                >
                    <ToggleButton value="all">ALL</ToggleButton>
                    <ToggleButton value="todo">To Do</ToggleButton>
                    <ToggleButton value="in-progress">In Progress</ToggleButton>
                    <ToggleButton value="done">Done</ToggleButton>
                </ToggleButtonGroup>

                <TextField
                    select
                    label="Sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    fullWidth
                    sx={{
                        mb: 2,
                        "*": {color: "#1976d2", borderColor: "#1976d2"},
                    }}
                >
                    <MenuItem value="newest">Newest first</MenuItem>
                    <MenuItem value="priority-desc">Priority DESC</MenuItem>
                    <MenuItem value="priority-asc">Priority ASC</MenuItem>
                </TextField>

                {visibleTasks?.length ? (
                    visibleTasks.map((task: any) => {
                        const currentTaskId = task.id;
                        return (
                            <DraggableTask key={currentTaskId} task={task}>
                                <TaskCardUI
                                    task={task}
                                    onDelete={(id: string) => deleteMutation.mutate(id)}
                                    onEdit={setEditingTask}
                                    onStatusChange={(id: string, s: string) => updateStatusMutation.mutate({taskId: id, status: s})}
                                />
                            </DraggableTask>
                        );
                    })
                ) : (
                    <Typography variant="body1">No tasks</Typography>
                )}
                </Box>
                {activeDragTask && (
                    <Box sx={{
                        position: 'fixed', inset: 0, zIndex: 100,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        p: 4
                    }}>
                        <Box sx={{ display: 'flex', width: '100%', maxWidth: '900px', gap: 2 }}>
                            <DroppableZone id="zone-todo" title="TO DO" icon={<Assignment fontSize="large" />} colorBg="#1976d2" />
                            <DroppableZone id="zone-in-progress" title="IN PROGRESS" icon={<PendingActions fontSize="large" />} colorBg="#ed6c02" />
                            <DroppableZone id="zone-done" title="DONE" icon={<AssignmentTurnedIn fontSize="large" />} colorBg="#2e7d32" />
                        </Box>
                    </Box>
                )}

                <DragOverlay>
                    {activeDragTask ? (
                        <Box sx={{ width: 343 }}>
                            <TaskCardUI task={activeDragTask} isOverlay />
                        </Box>
                    ) : null}
                </DragOverlay>
                <Dialog open={!!editingTask} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit task</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Title"
                            fullWidth
                            value={editFormData.title}
                            onChange={(e) => setEditFormData(prev => ({...prev, title: e.target.value}))}
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={editFormData.description}
                            onChange={(e) => setEditFormData(prev => ({...prev, description: e.target.value}))}
                            margin="normal"
                        />
                        <Typography gutterBottom>Priority</Typography>
                        <Slider
                            value={editFormData.priority}
                            step={1}
                            min={1}
                            max={10}
                            valueLabelDisplay="auto"
                            marks={[
                                {value: 1, label: 'Low'},
                                {value: 10, label: 'High'},
                            ]}
                            onChange={handleChangePriority}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEdit}>Cancel</Button>
                        <Button
                            onClick={handleUpdateTask}
                            variant="contained"
                            disabled={updateTaskMutation.isLoading || !editFormData.title.trim()}
                        >
                            {updateTaskMutation.isLoading ? "Saving..." : "Save"}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={successOpen}
                    autoHideDuration={3000}
                    onClose={() => setSuccessOpen(false)}
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                >
                    <Alert
                        onClose={() => setSuccessOpen(false)}
                        severity="success"
                        variant="filled"
                        sx={{width: "100%"}}
                    >
                        {successMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </DndContext>
    );
}
