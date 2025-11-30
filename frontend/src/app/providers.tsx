"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode, useState } from "react";
import { AuthProvider } from "@/api/authContext";

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryClientProvider>
    );
}
