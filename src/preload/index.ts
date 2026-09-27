import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export type OpenUrlRequest = {
  webContentsId: number;
  url: string;
  disposition: string;
};

const subscribe =
  <T>(channel: string) =>
  (callback: (payload: T) => void) => {
    const listener = (_event: IpcRendererEvent, payload: T) => callback(payload);
    ipcRenderer.on(channel, listener);
    return () => {
      ipcRenderer.off(channel, listener);
    };
  };

const api = {
  // menu accelerators, e.g. "new-tab"
  onShortcut: subscribe<string>("shortcut"),
  // a webview wants to open a new window, e.g. a link with target="_blank"
  onOpenUrl: subscribe<OpenUrlRequest>("open-url"),
};

export type MosaicApi = typeof api;

contextBridge.exposeInMainWorld("mosaic", api);
