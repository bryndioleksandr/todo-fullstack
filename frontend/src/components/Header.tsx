"use client";

import React, {useEffect, useState} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import { registerUser, loginUser, logoutUser } from "@/api/user";
import {Alert, Snackbar} from "@mui/material";
import { useQueryClient } from "react-query";


export default function Header() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAuth, setIsAuth] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const queryClient = useQueryClient();


    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) setIsAuth(true);
    }, []);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleToggleForm = () => setIsLogin(!isLogin);

    const handleSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const res = await loginUser({ username, password });
                localStorage.setItem("accessToken", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
                localStorage.setItem("user", JSON.stringify(res.user));
                handleSnackbar("Login successful!", "success");
                setIsAuth(true);
            } else {
                await registerUser({ username, password });
                handleSnackbar("Registration successful! You can now login.", "success");
                setIsLogin(true);
            }
            handleClose();
            setUsername("");
            setPassword("");
        } catch (err: any) {
            handleSnackbar(err.response?.data?.message || "Something went wrong", "error");
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            setIsAuth(false);
            queryClient.clear();
            handleSnackbar("Logged out successfully!", "success");
        } catch {
            handleSnackbar("Logout failed!", "error");
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        My ToDo App
                    </Typography>
                    {isAuth ? (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <Button color="inherit" onClick={handleOpen}>
                            Login / Register
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isLogin ? "Login" : "Register"}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Username"
                            type="text"
                            fullWidth
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {isLogin ? "Login" : "Register"}
                        </Button>
                    </Box>
                    <Button onClick={handleToggleForm} sx={{ mt: 1 }}>
                        {isLogin
                            ? "Don't have an account? Register"
                            : "Already have an account? Login"}
                    </Button>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity as "success" | "error"}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
