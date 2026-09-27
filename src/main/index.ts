import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from "electron";
import * as path from "path";
import windowStateKeeper from "electron-window-state";

const isDevelopment = !app.isPackaged;
const isMac = process.platform === "darwin";

function createMainWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 750,
    defaultHeight: 750,
  });

  const window = new BrowserWindow({
    // cannot access iframes without turning off websecurity
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      webSecurity: false,
      webviewTag: true,
    },
    frame: isMac,
    titleBarStyle: isMac ? "hidden" : "default",
    x: mainWindowState.x,
    y: mainWindowState.y,
    height: mainWindowState.height,
    width: mainWindowState.width,
    vibrancy: "window",
  });

  mainWindowState.manage(window);

  // spoof useragent
  window.webContents.userAgent =
    "Safari: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15";

  // remove X-Frame-Options and CORS headers
  window.webContents.session.webRequest.onHeadersReceived({ urls: ["*://*/*"] }, (details, callback) => {
    const responseHeaders = details.responseHeaders ?? {};
    Object.keys(responseHeaders)
      .filter((x) => ["x-frame-options", "content-security-policy"].includes(x.toLowerCase()))
      .map((x) => delete responseHeaders[x]);

    callback({
      cancel: false,
      responseHeaders,
    });
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (process.env.ELECTRON_RENDERER_URL) {
    window.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    window.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  const template: MenuItemConstructorOptions[] = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          } satisfies MenuItemConstructorOptions,
        ]
      : []),
    {
      label: "File",
      submenu: [
        {
          label: "New Tab",
          accelerator: "CmdOrCtrl+T",
          click: () => {
            window.webContents.send("shortcut", "new-tab");
          },
        },
        {
          label: "Close Tab",
          accelerator: "CmdOrCtrl+W",
          click: () => {
            window.webContents.send("shortcut", "close-tab");
          },
        },
      ],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        {
          label: "Find in page",
          accelerator: "CmdOrCtrl+F",
          click: () => {
            window.webContents.send("shortcut", "find-in-page");
          },
        },
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? ([
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ] satisfies MenuItemConstructorOptions[])
          : ([{ role: "delete" }, { type: "separator" }, { role: "selectAll" }] satisfies MenuItemConstructorOptions[])),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? ([
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ] satisfies MenuItemConstructorOptions[])
          : ([{ role: "close" }] satisfies MenuItemConstructorOptions[])),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            await shell.openExternal("https://github.com/mlajtos/mosaic");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return window;
}

// webviews can't open windows on their own, the renderer opens a new tab instead
app.on("web-contents-created", (_event, contents) => {
  if (contents.getType() !== "webview") {
    return;
  }

  contents.setWindowOpenHandler(({ url, disposition }) => {
    contents.hostWebContents?.send("open-url", { webContentsId: contents.id, url, disposition });
    return { action: "deny" };
  });
});

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.whenReady().then(createMainWindow);

// cannot access iframe content without this
app.commandLine.appendSwitch("disable-site-isolation-trials");
