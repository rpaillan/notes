import { create } from "zustand";

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
    if (lastKey === "Enter") {
        if (command === "new") {
            commander.enableTextMode();
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
    const state = useCommander.getState();
    console.log(state.mode, event.key, event.charCode, event.code);
    if (state.mode === "command") {
        if (event.key && event.key.length >= 1) {
            useCommander.getState().addKey(event.key);
        }
    }
    if (state.mode === "text" && event.key === "Escape") {
        useCommander.getState().enableCommandMode();
    }
};

document.addEventListener("keyup", onKeyPressed);
