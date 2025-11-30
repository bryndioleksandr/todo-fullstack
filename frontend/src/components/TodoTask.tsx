import {Box, Button, Card, CardContent, Chip, Typography} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import React from "react";

export const TaskCardUI = ({task, onDelete, onEdit, onStatusChange, isOverlay = false}: any) => {
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
        <Card sx={{
            mb: 2,
            boxShadow: isOverlay ? 20 : 3,
            cursor: isOverlay ? 'grabbing' : 'grab',
            backgroundColor: isOverlay ? '#e3f2fd' : '#fff'
        }}>
            <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                    {task.description}
                </Typography>

                <Box sx={{display: "flex", alignItems: "center", mb: 2, gap: 1}}>
                    <Typography variant="body2">Status:</Typography>
                    <Chip label={task.status} color={getStatusColor(task.status) as any} size="small"/>
                </Box>
                <Box sx={{display: "flex", alignItems: "center", mb: 2, gap: 1}}>
                    <Typography variant="body2">Priority:</Typography>
                    <Chip label={task.priority ? task.priority + ' / 10' : 'N/A'} size="small"/>
                </Box>

                {!isOverlay && (
                    <Box sx={{mt: 2}}>
                        <Box sx={{display: "flex", gap: 1, mb: 2, flexWrap: "wrap"}}>
                            <Button size="small" variant={task.status === "todo" ? "contained" : "outlined"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onStatusChange(task.id, "todo")
                                    }}>To Do</Button>
                            <Button size="small" color="warning"
                                    variant={task.status === "in-progress" ? "contained" : "outlined"} onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(task.id, "in-progress")
                            }}>In Progress</Button>
                            <Button size="small" color="success"
                                    variant={task.status === "done" ? "contained" : "outlined"} onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(task.id, "done")
                            }}>Done</Button>
                        </Box>
                        <Box sx={{display: "flex", gap: 1}}>
                            <Button variant="outlined" color="error" startIcon={<Delete/>} size="small"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={() => onDelete(task.id)}>Delete</Button>
                            <Button variant="outlined" color="primary" startIcon={<Edit/>} size="small"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={() => onEdit(task)}>Edit</Button>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};
