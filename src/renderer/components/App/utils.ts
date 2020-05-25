import { useEffect } from "react";
import { ipcRenderer } from "electron";

export const useShortcut = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    ipcRenderer.on("shortcut", (event, shortcutName) => {
      shortcuts?.[shortcutName]?.();
    });
  }, []);
};