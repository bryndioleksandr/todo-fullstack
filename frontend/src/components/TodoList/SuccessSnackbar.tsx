import { Snackbar, Alert } from "@mui/material";

interface SuccessSnackbarProps {
    open: boolean;
    message: string | null;
    onClose: () => void;
}

export const SuccessSnackbar = ({ open, message, onClose }: SuccessSnackbarProps) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                onClose={onClose}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

