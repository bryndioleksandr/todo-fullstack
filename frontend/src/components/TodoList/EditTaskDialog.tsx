import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Slider,
} from "@mui/material";
import { EditFormData } from "@/types/task";

interface EditTaskDialogProps {
    open: boolean;
    formData: EditFormData;
    isLoading: boolean;
    onClose: () => void;
    onSave: () => void;
    onFormDataChange: (data: EditFormData) => void;
}

export const EditTaskDialog = ({
    open,
    formData,
    isLoading,
    onClose,
    onSave,
    onFormDataChange,
}: EditTaskDialogProps) => {
    const handleChangePriority = (_: Event, newValue: number | number[]) => {
        onFormDataChange({ ...formData, priority: newValue as number });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit task</DialogTitle>
            <DialogContent>
                <TextField
                    label="Title"
                    fullWidth
                    value={formData.title}
                    onChange={(e) =>
                        onFormDataChange({ ...formData, title: e.target.value })
                    }
                    margin="normal"
                />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                        onFormDataChange({ ...formData, description: e.target.value })
                    }
                    margin="normal"
                />
                <Typography gutterBottom>Priority</Typography>
                <Slider
                    value={formData.priority}
                    step={1}
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                    marks={[
                        { value: 1, label: "Low" },
                        { value: 10, label: "High" },
                    ]}
                    onChange={handleChangePriority}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onSave}
                    variant="contained"
                    disabled={isLoading || !formData.title.trim()}
                >
                    {isLoading ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

