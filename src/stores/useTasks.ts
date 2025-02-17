import { create } from "zustand";
import { useCommander } from "./useCommander";

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

export interface Task {
    id: string;
    title: string;
    state: "open" | "in-progress" | "done" | "canceled";
}

interface TasksState {
    tasks: Task[];
    addTask: (task: Omit<Task, "id">) => void;
}

export const useTasks = create<TasksState>()(set => ({
    tasks: initialTasks,
    addTask: task => {
        const nTask = { ...task, id: crypto.randomUUID() };
        set(state => {
            const tasks = [nTask, ...state.tasks];
            return { tasks };
        });
        const commander = useCommander.getState();
        commander.enableCommandMode();
        commander.resetCommand();
    },
}));
