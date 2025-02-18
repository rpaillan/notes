import { create } from "zustand";
import { useCommander } from "./useCommander";

const initialTasks: Task[] = [
    {
        id: crypto.randomUUID(),
        title: "Well done is better than well said",
        desc: "The author of this quote is the famous Benjamin Franklin, recognised as one of the Founding Fathers of the United States. This quote encourages people to get down to work and stop procrastinating",
        state: "open",
    },
    {
        id: crypto.randomUUID(),
        title: "Once you choose hope, anything's possible",
        desc: "This famous phrase has no recognised author, so we cannot attribute it to anyone. However, it is very common and has a very beautiful meaning: when you choose hope, everything is possible.",
        state: "open",
    },
    {
        id: crypto.randomUUID(),
        title: "Try it again. Fail again. Fail better",
        desc: "A very famous quote in the business world. Failure is a part of life and especially of business; however, it should be seen as an opportunity to learn.",
        state: "open",
    },
    {
        id: crypto.randomUUID(),
        title: "Start wide, expand further, and never look back",
        desc: "Arnold Schwarzenegger, in addition to his acting and other accomplishments, including being a former Governor of California, also uttered this famous phrase.",
        state: "open",
    },
    {
        id: crypto.randomUUID(),
        title: "You only live once but if you do it right, once is enough",
        desc: "Mae West was an American actress, singer, comedian, screenwriter, and playwright. She is the author of this famous phrase in which she invites us to do things well and to live the moment to the fullest",
        state: "open",
    },
    {
        id: crypto.randomUUID(),
        title: "Sometimes the heart sees what is invisible to the eye",
        desc: "You've probably seen this famous phrase at some point. It is attributed to H Jackson Brown, an American singer-songwriter and musician. It means that sometimes the heart sees what the eye does not see.",
        state: "open",
    },
];

export interface Task {
    id: string;
    title: string;
    desc: string;
    state: "open" | "in-progress" | "done" | "canceled";
}

interface TasksState {
    tasks: Task[];
    addTask: (task: Omit<Task, "id">) => void;
    deleteTaskByPosition: (position: number) => boolean;
}

export const useTasks = create<TasksState>()((set, get) => ({
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
    deleteTaskByPosition: position => {
        if (position > 0 && position <= get().tasks.length) {
            const list = [...get().tasks];
            list.splice(position - 1, 1);
            set({ tasks: list });
            return true;
        }
        return false;
    },
}));
