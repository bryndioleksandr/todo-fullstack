"use client";

import { useMutation, useQueryClient } from "react-query";
import { createTask } from "@/api/task";
import { useEffect, useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField } from "@mui/material";

interface TodoModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TodoModal({ open, onClose }: TodoModalProps) {
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const queryClient = useQueryClient();

    const mutation = useMutation(
        async ({ userId, title, description }: { userId: string; title: string; description: string }) => {
            return await createTask(userId, title, description);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["tasks"]);
                setSuccessOpen(true);
                setTitle("");
                setDescription("");
                onClose();
            },
        }
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            alert("User not found. Please log in again.");
            return;
        }
        mutation.mutate({ userId: user.id, title, description });
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit} id="todo-create-form">
                        <TextField
                            margin="normal"
                            label="Title"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label="Description"
                            fullWidth
                            required
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="todo-create-form" variant="contained" disabled={mutation.isLoading || !title.trim()}>
                        {mutation.isLoading ? "Adding..." : "Add"}
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
                    Task successfully added!
                </Alert>
            </Snackbar>
        </>
    );
}
