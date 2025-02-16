import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useTasks } from "../stores/useTasks";
import { runCommand } from "./commander";

import "./home.css";

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

type CommanderState = "command" | "text";
const Commander: FC = () => {
    const [command, setCommand] = useState("");
    const [state, setState] = useState<CommanderState>("command");
    const inputRef = useRef<HTMLInputElement>(null);
    const addTask = useTasks(state => state.add);

    useEffect(() => {
        if (command && command.endsWith("+Enter")) {
            let c = command.replace("+Enter", "");
            console.log("command", c);
            if (c === "new") {
                setState("text");
                setCommand("");
            }
            if (c === "com") {
                setState("command");
                setCommand("");
            }
        }
        if (command && command.endsWith("+Escape")) {
            setCommand("");
            setState("command");
        }
    }, [command]);

    const onKeyPressed = (event: KeyboardEvent) => {
        //console.log(event.key, event.charCode, event.code, event);
        if (event.key && event.key.length === 1) {
            setCommand(c => c + event.key);
        }
        if (event.key && event.key.length > 1) {
            setCommand(c => c + "+" + event.key);
        }
    };

    useEffect(() => {
        document.addEventListener("keyup", onKeyPressed);
        return () => {
            console.log("undone");
            document.removeEventListener("keyup", onKeyPressed);
        };
    }, []);

    useEffect(() => {
        console.log("ffffoccusss", inputRef);
        if (inputRef.current && state === "text") {
            inputRef.current.focus();
        }
    }, [inputRef, state]);

    return (
        <div className="commander">
            <div className={state === "command" ? "visible" : "hidden"}>
                Command : {command}
            </div>
            <div className={state === "text" ? "visible" : "hidden"}>
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
                            setState("command");
                            setCommand("");
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
