"use client";

import TodoSection from "@/components/TodoSection";
import Header from "@/components/Header";

export default function Home() {
  return (
      <div className="font-sans min-h-screen flex flex-col items-center justify-center">
          <Header />
          <TodoSection />
      </div>
  );
}
