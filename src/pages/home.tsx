import { FC, useEffect, useRef } from "react";
import { useTasks } from "../stores/useTasks";

import "./home.css";
import { useCommander } from "../stores/useCommander";
import clsx from "clsx";

export const Home: FC = () => {
    return (
        <div>
            <Commander />
            <TaskView />
            <Info />
        </div>
    );
};

const Commander: FC = () => {
    const command = useCommander(state => state.command.join(""));
    const mode = useCommander(state => state.mode);
    const addTask = useTasks(state => state.addTask);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (inputRef.current && mode === "text") {
            inputRef.current.focus();
        }
    }, [inputRef, mode]);

    return (
        <div className="commander">
            <div className={clsx("command-mode", { hidden: mode !== "command" })}>
                [{mode}] {command}
            </div>
            <div className={clsx("text-mode", { hidden: mode !== "text" })}>
                [{mode}]
                <textarea
                    rows={5}
                    ref={inputRef}
                    onKeyUp={e => {
                        if (e.key === "Enter" && e.shiftKey) {
                            const target = e.target as HTMLInputElement;
                            if (target && target.value) {
                                const list = target.value.split("\n");
                                const title = list.shift() || "-- no title --";
                                const desc = list.join("\n") || "";
                                addTask({
                                    title,
                                    desc,
                                    state: "open",
                                });
                            }
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
                    <div className="task-view-title">
                        <div>{index + 1}.</div>
                        <div>({task.state})</div>
                        <div>{task.title}</div>
                    </div>
                    <div className="task-view-desc">{task.desc}</div>
                </div>
            ))}
        </div>
    );
};

const Info: FC = () => {
    const commands = [
        { name: "new task", code: "new" },
        { name: "delete", code: "d{pos}" },
        { name: "home", code: "[Escape]" },
    ];
    return (
        <div className="info-list">
            {commands.map(c => (
                <div key={c.name}>
                    {c.name} <code>{c.code}</code>
                </div>
            ))}
        </div>
    );
};
