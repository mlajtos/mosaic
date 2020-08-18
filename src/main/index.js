"use strict";

import { app, BrowserWindow, session } from "electron";
import * as path from "path";
import { promises as fs } from "fs";
import { format as formatUrl } from "url";
import { ElectronBlocker, fullLists, Request } from "@cliqz/adblocker-electron";
import fetch from "cross-fetch"; // required 'fetch'

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

async function createMainWindow() {
  const window = new BrowserWindow({
    // cannot access iframes without turning off websecurity
    webPreferences: { nodeIntegration: true, webSecurity: false, webviewTag: true },
    frame: process.platform !== 'darwin',
    // backgroundColor: "#222222",
    vibrancy: "window"
  });

  // ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
  //   blocker.enableBlockingInSession(session.defaultSession);
  // });

  // blocker.enableBlockingInSession(session.defaultSession);

  // spoof useragent
  window.webContents.userAgent =
    "Safari: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15";

  // remove X-Frame-Options and CORS headers
  window.webContents.session.webRequest.onHeadersReceived({ urls: ["*://*/*"] }, (details, callback) => {
    Object.keys(details.responseHeaders)
      .filter((x) => ["x-frame-options", "content-security-policy"].includes(x.toLowerCase()))
      .map((x) => delete details.responseHeaders[x]);

    callback({
      cancel: false,
      responseHeaders: details.responseHeaders,
    });
  });

  window.webContents.session.webRequest.onBeforeRequest({ urls: ["*://*/*"] }, (details, callback) => {
    //console.log(details)
    callback({ cancel: false });
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  window.webContents.on("new-window", (event) => {
    console.log(event);
    // TODO: open new tile
    //event.preventDefault();
  });

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  const { app, Menu } = require("electron");

  const isMac = process.platform === "darwin";

  const template = [
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
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
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
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
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
          ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }]
          : [{ role: "close" }]),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            const { shell } = require("electron");
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

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", async () => {
  mainWindow = await createMainWindow();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});

// cannot access iframe content without this
app.commandLine.appendSwitch("disable-site-isolation-trials");

// Electron 9 will have it as default, and I am tired of the console message
app.allowRendererProcessReuse = true;
