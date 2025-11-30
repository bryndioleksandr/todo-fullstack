import { Box } from "@mui/material";
import { Assignment, AssignmentTurnedIn, PendingActions } from "@mui/icons-material";
import { DroppableZone } from "@/components/DnD/DroppableZone";
import { Task } from "@/types/task";

interface DragOverlayModalProps {
    activeTask: Task | null;
}

export const DragOverlayModal = ({ activeTask }: DragOverlayModalProps) => {
    if (!activeTask) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
            }}
        >
            <Box sx={{ display: "flex", width: "100%", maxWidth: "900px", gap: 2 }}>
                <DroppableZone
                    id="zone-todo"
                    title="TO DO"
                    icon={<Assignment fontSize="large" />}
                    colorBg="#1976d2"
                />
                <DroppableZone
                    id="zone-in-progress"
                    title="IN PROGRESS"
                    icon={<PendingActions fontSize="large" />}
                    colorBg="#ed6c02"
                />
                <DroppableZone
                    id="zone-done"
                    title="DONE"
                    icon={<AssignmentTurnedIn fontSize="large" />}
                    colorBg="#2e7d32"
                />
            </Box>
        </Box>
    );
};

