import React, { useRef, useState, useCallback, useEffect } from "react";
import GoldenLayout from "golden-layout";
import { useRecoilState } from "recoil";

import QueryField from "../QueryField";
import Toolbar from "../Toolbar";
import DomainInfo from "../DomainInfo";
import Webview from "../Webview";
import Tile from "../Tile";
import ToolbarButton from "../ToolbarButton";
import PageState from "../PageState";
import Tab from "../Tab";

import { useEventListener } from "./utils";
import { remote } from "electron";
import DefaultTileConfig from "../DefaultTileConfig";

const Space = () => <div style={{ width: "0.5rem" }} />;

export default ({ container, state }: { container: GoldenLayout.Container; state: any }) => {
  const webviewRef = useRef<HTMLWebViewElement>(null);
  const [queryHasFocus, setQueryHasFocus] = useState(false);

  const [{ title, url, query, loading, favicons }, setPageState] = useRecoilState(PageState);

  useEffect(() => {
    // if (url === "") {
      setPageState((page) => ({ ...page, url: container._config.url }));
    // }
  }, []);

  const on = useEventListener(webviewRef);

  on("did-start-loading", () => setPageState((page) => ({ ...page, loading: true })));
  on("did-stop-loading", () => setPageState((page) => ({ ...page, loading: false })));
  on("page-favicon-updated", ({ favicons }) => setPageState((page) => ({ ...page, favicons })));
  on("will-navigate", ({ url }) => {
    setPageState((state) => ({ ...state, url, favicons: [], query: url }));
  });
  on("will-navigate", ({ url }) => setPageState((page) => ({ ...page, url })));
  on("new-window", ({ url }) => {
    // open new tab in background
    const newTab = DefaultTileConfig({ url });
    container.parent.parent.addChild(newTab);
    container.parent.parent.setActiveContentItem(container.parent);
  });

  on("page-title-updated", ({ title }) => setPageState((page) => ({ ...page, title })));

  const onLoad = useCallback((e) => {
    console.log(e);
    const webContentsId = e.target.getWebContentsId();
    const webContents = remote.webContents.fromId(webContentsId);
    console.log(webContents);
    // webContents.executeJavaScript("MosaicInternal.zoomToFit()");
    // setUrl(e.target.contentWindow.location.href);
    // setQuery(e.target.contentWindow.location.href);
    // zoomToFit(e.target.contentWindow.document.documentElement);
  }, []);
  // on("did-stop-loading", onLoad);

  return (
    <Tile>
      <Tab for={container} />
      <Toolbar>
        {queryHasFocus ? (
          <QueryField
            value={query}
            onChange={(query) => setPageState((page) => ({ ...page, query }))}
            onConfirm={(url) => {
              setPageState((page) => ({ ...page, url, query: url }));
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
                // @ts-ignore
                webviewRef.current?.goBack();
              }}
            >
              ←
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                // @ts-ignore
                webviewRef.current?.goForward();
              }}
            >
              →
            </ToolbarButton>
            <Space />
            <div
              onClick={() => {
                setQueryHasFocus(true);
              }}
            >
              <DomainInfo url={url} />
            </div>
          </>
        )}
      </Toolbar>
      <Webview $ref={webviewRef} url={url} />
    </Tile>
  );
};
