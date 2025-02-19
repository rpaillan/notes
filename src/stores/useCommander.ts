import { create } from "zustand";
import { useTasks } from "./useTasks";

interface CommanderState {
    command: string[];
    mode: "command" | "text";
    addKey: (key: string) => void;
    removeLastKey: () => void;
    enableTextMode: () => void;
    enableCommandMode: () => void;
    resetCommand: () => void;
}

export const useCommander = create<CommanderState>()(set => ({
    command: [],
    mode: "command",
    addKey: key => processCommand(key),
    removeLastKey: () =>
        set(state => ({
            command: state.command.slice(0, state.command.length - 1),
        })),
    enableTextMode: () => set({ mode: "text" }),
    enableCommandMode: () => set({ mode: "command" }),
    resetCommand: () => set({ command: [] }),
}));

const processCommand = (lastKey: string) => {
    const commander = useCommander.getState();
    const command = commander.command.join("");
    const tasksState = useTasks.getState();
    //console.log("Testing command (" + command + ") last key (" + lastKey + ")");
    if (lastKey === "Enter") {
        if (command === "new") {
            // TODO how to solve this issue
            // if we press Enter
            // the areatext is shown but enter event is still present
            // so a new line is added to the textarea
            // then, adding setTimeout we make sure the change to text mode
            // is made in the future
            setTimeout(() => {
                commander.enableTextMode();
            }, 0);
        }
        if (/d\d+/g.test(command)) {
            const position = parseInt(command.replace("d", ""));
            tasksState.deleteTaskByPosition(position);
        }
        if (/s\d+/g.test(command)) {
            const position = parseInt(command.replace("s", ""));
            tasksState.selectTask(position);
        }
        commander.resetCommand();
    } else if (lastKey === "Escape") {
        commander.enableCommandMode();
        commander.resetCommand();
    } else if (lastKey === "Backspace") {
        commander.removeLastKey();
    } else {
        useCommander.setState({ command: [...commander.command, lastKey] });
    }
};

const onKeyPressed = (event: KeyboardEvent) => {
    //event.stopPropagation();
    //event.preventDefault();
    const state = useCommander.getState();
    /* console.log(
        state.mode,
        event.key,
        event.charCode,
        event.code,
        "alt:" + event.altKey,
        "shift:" + event.shiftKey,
        "ctrl:" + event.ctrlKey,
        "meta:" + event.metaKey,
    ); */
    if (state.mode === "command") {
        if (event.key && event.key.length >= 1) {
            useCommander.getState().addKey(event.key);
        }
    }
};

const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.key === "Backspace") {
        useCommander.getState().addKey(event.key);
    }
};

document.addEventListener("keypress", onKeyPressed);
document.addEventListener("keyup", onKeyUp);
