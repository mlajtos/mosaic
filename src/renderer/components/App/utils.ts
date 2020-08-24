import { useEffect } from "react";
import { ipcRenderer, IpcRendererEvent } from "electron";

export const useShortcut = (shortcuts: Record<string, () => void>, deps: any[] = []) => {
  useEffect(() => {
    const callback = (event: IpcRendererEvent, shortcutName: string) => {
      shortcuts?.[shortcutName]?.();
    };

    ipcRenderer.on("shortcut", callback);

    return () => {
      ipcRenderer.off("shortcut", callback);
    };
  }, deps);
};
