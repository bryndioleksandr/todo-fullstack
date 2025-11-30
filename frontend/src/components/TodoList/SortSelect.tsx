import { TextField, MenuItem } from "@mui/material";
import { SortOption } from "@/types/task";

interface SortSelectProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
    return (
        <TextField
            select
            label="Sort"
            value={value}
            onChange={(e) => onChange(e.target.value as SortOption)}
            fullWidth
            sx={{
                mb: 2,
                "*": { color: "#1976d2", borderColor: "#1976d2" },
            }}
        >
            <MenuItem value="">Newest first</MenuItem>
            <MenuItem value="priority-desc">Priority DESC</MenuItem>
            <MenuItem value="priority-asc">Priority ASC</MenuItem>
        </TextField>
    );
};

