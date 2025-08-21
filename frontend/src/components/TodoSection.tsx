"use client";

import {useEffect, useState} from "react";
import TodoList from "./TodoList";
import TodoModal from "./TodoModal";
import {Typography} from "@mui/material";

export default function TodoSection() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    if (!user) return <Typography variant="h6">Будь ласка, увійдіть, щоб побачити завдання</Typography>;

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">My Todo App</h1>

            <button
                onClick={handleOpenModal}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Add Task
            </button>

            <TodoModal open={open} onClose={handleCloseModal} />

            <TodoList />
        </div>
    );
}
