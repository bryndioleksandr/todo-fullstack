import React from "react";
import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

export const DraggableTask = ({task, children}: { task: any, children: React.ReactNode }) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: task.id.toString(),
        data: task,
    });
    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}
