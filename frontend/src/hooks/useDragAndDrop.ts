import { useState } from "react";
import { MouseSensor, TouchSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Task } from "@/types/task";

export const useDragAndDrop = (tasks: Task[] | undefined) => {
    const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 5 } })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks?.find((t) => t.id.toString() === active.id);
        if (task) {
            setActiveDragTask(task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveDragTask(null);
        return event;
    };

    return {
        activeDragTask,
        sensors,
        handleDragStart,
        handleDragEnd,
    };
};

