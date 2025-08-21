"use client";

import TodoSection from "@/components/TodoSection";
import Header from "@/components/Header";

export default function Home() {
    return (
        <div className="font-sans min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 bg-white shadow-md">
                <Header />
            </header>

            <main className="flex-grow flex items-center justify-center">
                <TodoSection />
            </main>
        </div>
    );
}
