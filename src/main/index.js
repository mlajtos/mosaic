"use strict";

import { app, BrowserWindow } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    // cannot access iframes without turning off websecurity
    webPreferences: { nodeIntegration: true, webSecurity: false, webviewTag: true },
  });

  window.maximize();

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
app.on("ready", () => {
  mainWindow = createMainWindow();
});

// cannot access iframe content without this
app.commandLine.appendSwitch("disable-site-isolation-trials");


// Electron 9 will have it as default, and I am tired of the console message
app.allowRendererProcessReuse = true;