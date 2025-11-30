"use client";

import {createContext, useContext, useState, useEffect, ReactNode} from "react";

type User = {
    id: string;
    username: string;
};

type AuthContextType = {
    user: User | null;
    isAuth: boolean;
    login: (userData: { user: User; accessToken: string; refreshToken: string }) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    // Ініціалізація з localStorage при завантаженні
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
    }, []);

    const login = (userData: { user: User; accessToken: string; refreshToken: string }) => {
        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);
        localStorage.setItem("user", JSON.stringify(userData.user));
        setUser(userData.user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, isAuth: !!user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
