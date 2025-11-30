import {useDroppable} from "@dnd-kit/core";
import {Paper, Typography} from "@mui/material";
import React from "react";

export const DroppableZone = ({id, title, icon, colorBg, active}: any) => {
    const {setNodeRef, isOver} = useDroppable({id});
    return (
        <Paper
            ref={setNodeRef}
            elevation={isOver ? 10 : 1}
            sx={{
                flex: 1, m: 1, p: 3,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                border: '3px dashed',
                borderColor: isOver ? '#fff' : 'rgba(255,255,255,0.5)',
                backgroundColor: isOver ? colorBg : 'rgba(0,0,0,0.4)',
                color: '#fff',
                transition: 'all 0.2s ease',
                height: '300px',
                transform: isOver ? 'scale(1.05)' : 'scale(1)',
            }}
        >
            {icon}
            <Typography variant="h5" sx={{mt: 2}}>{title}</Typography>
        </Paper>
    );
}
