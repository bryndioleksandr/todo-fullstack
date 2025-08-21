"use client";

import { useQuery } from "react-query";
import { fetchUserTasks } from "@/api/task";
import { useEffect, useState } from "react";

export default function TodoList() {
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);

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

    useEffect(() => {
        if (user) {
            refetch();
        }
    }, [user]);

    if (!user) return <p>Please login to see tasks</p>;
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading tasks</p>;

    return (
        <div>
            {tasks?.map((task: any) => (
                <div key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <span>{task.status}</span>
                </div>
            ))}
        </div>
    );
}
