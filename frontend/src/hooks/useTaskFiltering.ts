import { useState, useMemo } from "react";
import { StatusFilter, SortOption, Task } from "@/types/task";
import { processTasks } from "@/utils/taskUtils";

export const useTaskFiltering = (tasks: Task[] | undefined) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [sortBy, setSortBy] = useState<SortOption>("");

    const visibleTasks = useMemo(() => {
        return processTasks(tasks, search, statusFilter, sortBy);
    }, [tasks, search, statusFilter, sortBy]);

    return {
        search,
        statusFilter,
        sortBy,
        visibleTasks,
        setSearch,
        setStatusFilter,
        setSortBy,
    };
};

