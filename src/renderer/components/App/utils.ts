import { useEffect } from "react";
import { ipcRenderer } from "electron";

export const useShortcut = (shortcuts: Record<string, () => void>, deps: any[] = []) => {
  useEffect(() => {
    const callback = (event, shortcutName) => {
      shortcuts?.[shortcutName]?.();
    };

    ipcRenderer.on("shortcut", callback);

    return () => {
      ipcRenderer.off("shortcut", callback);
    };
  }, deps);
};
