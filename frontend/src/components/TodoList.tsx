"use client";

import {useMutation, useQuery, useQueryClient} from "react-query";
import {deleteTask, fetchUserTasks, updateTask} from "@/api/task";
import { useEffect, useState } from "react";
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
    DialogActions,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

interface EditFormData {
    title: string;
    description: string;
}

export default function TodoList() {
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "in-progress" | "done">("all");
    const [editingTask, setEditingTask] = useState<any>(null);
    const [editFormData, setEditFormData] = useState<EditFormData>({ title: "", description: "" });
    const [successOpen, setSuccessOpen] = useState(false);

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

    const { data: tasks, isLoading, error, refetch } = useQuery(
        ["tasks", user?.id],
        () => fetchUserTasks(user!.id),
        { enabled: !!user }
    );

    const deleteMutation = useMutation(
        (taskId: string) => deleteTask(taskId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["tasks"]);
                setSuccessMessage("Завдання успішно видалено!");
                setSuccessOpen(true);
            },
        }
    );

    const updateStatusMutation = useMutation(
        ({ taskId, status }: { taskId: string; status: string }) =>
            updateTask(taskId, { status }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["tasks"]);
                setSuccessMessage("Статус завдання оновлено!");
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
                setSuccessMessage("Завдання успішно оновлено!");
                setSuccessOpen(true);
                setEditingTask(null);
                setEditFormData({ title: "", description: "" });
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
        updateStatusMutation.mutate({ taskId, status: newStatus });
    };

    const handleEdit = (task: any) => {
        setEditingTask(task);
        setEditFormData({
            title: task.title,
            description: task.description
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
        setEditFormData({ title: "", description: "" });
    };

    if (!user) return <Typography variant="h6">Будь ласка, увійдіть, щоб побачити завдання</Typography>;
    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Помилка завантаження завдань</Typography>;

    const filteredTasks = tasks?.filter((task: any) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    );

    const visibleTasks = filteredTasks?.filter((task: any) =>
        statusFilter === "all" ? true : task.status === statusFilter
    );

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

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
            <TextField
                label="Пошук завдань"
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
                <ToggleButton value="all">Усі</ToggleButton>
                <ToggleButton value="todo">To Do</ToggleButton>
                <ToggleButton value="in-progress">In Progress</ToggleButton>
                <ToggleButton value="done">Done</ToggleButton>
            </ToggleButtonGroup>

            {visibleTasks?.length ? (
                visibleTasks.map((task: any) => (
                    <Card key={task.id} sx={{ mb: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{task.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {task.description}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
                                <Typography variant="body2">Статус:</Typography>
                                <Chip
                                    label={task.status}
                                    color={getStatusColor(task.status) as any}
                                />
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                                <Button
                                    variant={task.status === "todo" ? "contained" : "outlined"}
                                    color="primary"
                                    size="small"
                                    onClick={() => handleStatusChange(task.id, "todo")}
                                    disabled={updateStatusMutation.isLoading || task.status === "todo"}
                                >
                                    To Do
                                </Button>
                                <Button
                                    variant={task.status === "in-progress" ? "contained" : "outlined"}
                                    color="warning"
                                    size="small"
                                    onClick={() => handleStatusChange(task.id, "in-progress")}
                                    disabled={updateStatusMutation.isLoading || task.status === "in-progress"}
                                >
                                    In Progress
                                </Button>
                                <Button
                                    variant={task.status === "done" ? "contained" : "outlined"}
                                    color="success"
                                    size="small"
                                    onClick={() => handleStatusChange(task.id, "done")}
                                    disabled={updateStatusMutation.isLoading || task.status === "done"}
                                >
                                    Done
                                </Button>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete />}
                                    size="small"
                                    onClick={() => handleDelete(task.id)}
                                    disabled={deleteMutation.isLoading}
                                >
                                    Видалити
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<Edit />}
                                    size="small"
                                    onClick={() => handleEdit(task)}
                                >
                                    Редагувати
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography variant="body1">Немає завдань</Typography>
            )}

            <Dialog open={!!editingTask} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                <DialogTitle>Редагувати завдання</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Назва"
                        fullWidth
                        value={editFormData.title}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                        margin="normal"
                    />
                    <TextField
                        label="Опис"
                        fullWidth
                        multiline
                        rows={3}
                        value={editFormData.description}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit}>Скасувати</Button>
                    <Button
                        onClick={handleUpdateTask}
                        variant="contained"
                        disabled={updateTaskMutation.isLoading || !editFormData.title.trim()}
                    >
                        {updateTaskMutation.isLoading ? "Збереження..." : "Зберегти"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSuccessOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
