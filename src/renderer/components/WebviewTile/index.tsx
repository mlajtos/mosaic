import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useView } from "@danfessler/trellis-react";
import type { WebviewTag } from "electron";

import QueryField from "../QueryField";
import Toolbar from "../Toolbar";
import DomainInfo from "../DomainInfo";
import Webview from "../Webview";
import ToolbarButton from "../ToolbarButton";
import FindInPageDialog from "../FindInPageDialog";
import Favicon from "../Favicon";
import PageLoadProgressIndicator from "../PageLoadProgressIndicator";

import { useEventListener, getWebContentsId, useTabIcon } from "./utils";

import "./style.css";
import leftArrow from "./left.svg";
import rightArrow from "./right.svg";

// persisted with the layout
export type PageParams = { url: string };

const Space = () => <div style={{ width: "0.5rem" }} />;

export default () => {
  const view = useView<PageParams>();
  const webviewRef = useRef<WebviewTag>(null);
  // the webview navigates by itself after the first load and `params.url` follows it
  const [initialUrl] = useState(view.params.url);
  const [queryHasFocus, setQueryHasFocus] = useState(initialUrl === "about:blank");
  const [{ query, loading, favicons }, setPageState] = useState({
    query: "",
    loading: false,
    favicons: [] as string[],
  });
  const tabIcon = useTabIcon(view.id);

  const on = useEventListener(webviewRef);

  on("did-start-loading", () => setPageState((page) => ({ ...page, loading: true })));
  on("did-stop-loading", () => setPageState((page) => ({ ...page, loading: false })));
  on("page-favicon-updated", ({ favicons }) => setPageState((page) => ({ ...page, favicons })));
  on("page-title-updated", ({ title }) => view.setTitle(title));
  on("did-navigate", ({ url }) => {
    view.setParams({ url });
    setPageState((page) => ({ ...page, favicons: [] }));
  });
  on("did-navigate-in-page", ({ url, isMainFrame }) => {
    if (isMainFrame) {
      view.setParams({ url });
    }
  });
  on("did-stop-loading", async () => {
    const webview = webviewRef.current!;
    const zoomFactor = await webview.executeJavaScript(
      "document.documentElement.clientWidth / document.documentElement.scrollWidth"
    );
    if (zoomFactor > 0) {
      webview.setZoomFactor(zoomFactor);
    }
  });

  // Trellis focuses a tile when focus moves into it, but a click inside a webview never reaches this page
  useEffect(
    () =>
      window.mosaic.onWebviewMouseDown((webContentsId) => {
        if (webContentsId === getWebContentsId(webviewRef.current)) {
          webviewRef.current?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
        }
      }),
    []
  );

  useEffect(
    () =>
      window.mosaic.onOpenUrl(({ webContentsId, url, disposition }) => {
        if (webContentsId !== getWebContentsId(webviewRef.current)) {
          return;
        }

        // open new tab next to this one; `view` is from the first render, so ask for its current panel
        const { workspace, id } = view;
        const panelId = workspace.view(id)?.panelId;
        const foreground = disposition === "foreground-tab";
        workspace.open("webview", {
          params: { url },
          placement: panelId ? { into: panelId } : "tab",
          focus: foreground,
        });
        if (!foreground) {
          workspace.select(id);
        }
      }),
    []
  );

  return (
    <div className="WebviewTile">
      {tabIcon && createPortal(loading ? <PageLoadProgressIndicator /> : <Favicon source={favicons} />, tabIcon)}
      <Toolbar>
        {queryHasFocus ? (
          <QueryField
            value={query}
            onChange={(query) => setPageState((page) => ({ ...page, query }))}
            onConfirm={(url) => {
              // failures show up in the page itself
              webviewRef.current?.loadURL(url).catch(() => {});
              setQueryHasFocus(false);
            }}
            focused={queryHasFocus}
            onBlur={() => {
              setQueryHasFocus(false);
            }}
          />
        ) : (
          <>
            <ToolbarButton
              onClick={() => {
                webviewRef.current?.goBack();
              }}
            >
              <img src={leftArrow} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                webviewRef.current?.goForward();
              }}
            >
              <img src={rightArrow} />
            </ToolbarButton>
            <Space />
            <div
              onClick={() => {
                const { url } = view.params;
                setPageState((page) => ({ ...page, query: url === "about:blank" ? "" : url }));
                setQueryHasFocus(true);
              }}
            >
              <DomainInfo url={view.params.url} />
            </div>
          </>
        )}
        <FindInPageDialog webviewRef={webviewRef} />
      </Toolbar>
      <Webview ref={webviewRef} src={initialUrl} />
    </div>
  );
};
