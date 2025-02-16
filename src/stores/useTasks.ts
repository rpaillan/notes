import { create } from "zustand";

export interface Task {
    id: string;
    title: string;
    state: "open" | "in-progress" | "done" | "canceled";
}

interface TasksState {
    tasks: Task[];
    add: (task: Omit<Task, "id">) => void;
}

const initialTasks: Task[] = [
    {
        id: crypto.randomUUID(),
        title: "Generate Stakeholder Register for this month",
        state: "open",
    },
    {
        id: crypto.randomUUID(),
        title: "Perform Qualitative Risk Analysis",
        state: "open",
    },
    {
        id: crypto.randomUUID(),
        title: "Identify Project Exclusions",
        state: "open",
    },
];

export const useTasks = create<TasksState>()(set => ({
    tasks: initialTasks,
    add: task => {
        const nTask = { ...task, id: crypto.randomUUID() };
        set(state => {
            const tasks = [nTask, ...state.tasks];
            return { tasks };
        });
    },
}));
