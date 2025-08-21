"use client";

import { useState } from "react";
import TodoList from "./TodoList";
import TodoModal from "./TodoModal";

export default function TodoSection() {
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">My Todo App</h1>

            <button
                onClick={handleOpenModal}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Add Task
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <button
                            onClick={handleCloseModal}
                            className="text-red-500 mb-4"
                        >
                            Close
                        </button>
                        {showModal && <TodoModal onClose={() => setOpen(false)} />}
                    </div>
                </div>
            )}

            <TodoList />
        </div>
    );
}
