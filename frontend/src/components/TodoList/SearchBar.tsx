import { TextField } from "@mui/material";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <TextField
            label="Search"
            variant="outlined"
            fullWidth
            color="primary"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
                mb: 2,
                "& .MuiInputBase-input": {
                    color: "#1976d2",
                },
                "& .MuiInputLabel-root": {
                    color: "#1565c0",
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#1976d2",
                    },
                    "&:hover fieldset": {
                        borderColor: "#1565c0",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#0d47a1",
                    },
                },
            }}
        />
    );
};

