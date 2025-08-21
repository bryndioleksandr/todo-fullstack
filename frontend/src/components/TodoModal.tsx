"use client";

import { useMutation, useQueryClient } from "react-query";
import { createTask } from "@/api/task";
import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

interface TodoModalProps {
    onClose: () => void;
}

export default function TodoModal({ onClose }: TodoModalProps) {
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
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

        const form = e.currentTarget;
        const title = (form.elements.namedItem("title") as HTMLInputElement).value;
        const description = (form.elements.namedItem("description") as HTMLInputElement).value;

        mutation.mutate({
            userId: user.id,
            title,
            description,
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" required />
                <input name="description" placeholder="Description" required />
                <button type="submit" disabled={mutation.isLoading}>
                    {mutation.isLoading ? "Adding..." : "Add Task"}
                </button>
            </form>

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
