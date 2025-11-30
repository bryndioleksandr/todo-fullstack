import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { StatusFilter } from "@/types/task";

interface FilterButtonsProps {
    value: StatusFilter;
    onChange: (value: StatusFilter) => void;
}

export const FilterButtons = ({ value, onChange }: FilterButtonsProps) => {
    return (
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(_, newStatus) => {
                if (newStatus !== null) onChange(newStatus);
            }}
            sx={{
                mb: 3,
                display: "flex",
                justifyContent: "center",
                "& .MuiToggleButton-root": {
                    color: "#1976d2",
                    border: "1px solid #1976d2",
                    borderRadius: "8px",
                    mx: 0.5,
                    "&.Mui-selected": {
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        borderColor: "#1976d2",
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "#1565c0",
                    },
                    "&:hover": {
                        backgroundColor: "#e3f2fd",
                    },
                },
            }}
        >
            <ToggleButton value="all">ALL</ToggleButton>
            <ToggleButton value="todo">To Do</ToggleButton>
            <ToggleButton value="in-progress">In Progress</ToggleButton>
            <ToggleButton value="done">Done</ToggleButton>
        </ToggleButtonGroup>
    );
};

