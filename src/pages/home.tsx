import { FC, useEffect, useRef } from "react";
import { useTasks } from "../stores/useTasks";

import "./home.css";
import { useCommander } from "../stores/useCommander";

export const Home: FC = () => {
    return (
        <div>
            <Commander />
            <TaskView />
        </div>
    );
};

/*
- d23 delete line 23
- m23:4 move line 23 to 6
*/

const Commander: FC = () => {
    const command = useCommander(state => state.command.join(""));
    const mode = useCommander(state => state.mode);
    const addTask = useTasks(state => state.addTask);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current && mode === "text") {
            inputRef.current.focus();
        }
    }, [inputRef, mode]);

    return (
        <div className="commander">
            <div
                className={
                    "command-mode " +
                    (mode === "command" ? "visible" : "hidden")
                }
            >
                [{mode}] {command}
            </div>
            <div
                className={
                    "text-mode " + (mode === "text" ? "visible" : "hidden")
                }
            >
                [{mode}]
                <input
                    ref={inputRef}
                    onKeyUp={e => {
                        if (e.key === "Enter") {
                            const target = e.target as HTMLInputElement;
                            addTask({
                                title: target.value,
                                state: "open",
                            });
                            target.value = "";
                        }
                    }}
                />
            </div>
        </div>
    );
};

const TaskView: FC = () => {
    const tasks = useTasks(state => state.tasks);
    return (
        <div>
            {tasks.map((task, index) => (
                <div className="task-view" key={task.id}>
                    <div>{index + 1}</div>
                    <div>({task.state})</div>
                    <div>{task.title}</div>
                </div>
            ))}
        </div>
    );
};
