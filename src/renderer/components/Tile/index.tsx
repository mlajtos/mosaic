import React, { useState, useCallback, useRef, useEffect, RefObject } from "react";

import { remote } from "electron";

import { MosaicWindow } from "react-mosaic-component";

import "./style.scss";
import Favicon from "../Favicon";
import PageLoadProgressIndicator from "../PageLoadProgressIndicator";
import QueryField from "../QueryField";
import RemoveButton from "../RemoveButton";
import ToolbarButton from "../ToolbarButton";
import { useAppActions, useAppState, Path, TileId } from "../App";

import { useEventListener } from "./utils";
import CollapsibleText from "../CollapsibleText";
import DomainInfo from "../DomainInfo";
import SearchIcon from "../SearchIcon";

type Props = {
  id: TileId;
  path: Path;
};

const isShortcut = (shortcut: string, e: React.KeyboardEvent<HTMLElement>) => {
  const shortcuts: Record<string, (e: React.KeyboardEvent<HTMLElement>) => boolean> = {
    "focus-query-field": (e) => e.key === "l" && e.metaKey,
    "blur-query-field": (e) => e.key === "Escape",
  };

  return shortcuts[shortcut]?.(e);
};

export default ({ id, path }: Props) => {
  const { create, update, split } = useAppActions();
  const { urls } = useAppState();

  const webviewRef = useRef<HTMLWebViewElement>(null);
  const [queryFieldFocused, setQueryFieldFocused] = useState(false);
  const on = useEventListener(webviewRef);

  const [query, setQuery] = useState(urls[id]);
  const [url, setUrl] = useState(urls[id]);
  const [title, setTitle] = useState("");
  const [favicons, setFavicons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  on("page-title-updated", ({ title }) => setTitle(title));
  on("did-start-loading", () => setIsLoading(true));
  on("did-stop-loading", () => setIsLoading(false));
  on("did-stop-loading", onLoad);
  on("page-favicon-updated", ({ favicons }) => setFavicons(favicons));
  on("will-navigate", ({ url }) => {
    setFavicons([]);
    setUrl(url);
    setQuery(url);
  });
  on("new-window", ({ url }) => split({ path, url }), [path]);
  on("will-navigate", ({ url }) => update({ id, url }));

  return (
    <MosaicWindow<string>
      path={path}
      createNode={() => Math.random().toString()}
      onDragStart={() => {
        console.log("drag start");
        document.body.classList.add("dragging");
      }}
      onDragEnd={() => {
        console.log("drag end");
        document.body.classList.remove("dragging");
      }}
      title={title}
      renderToolbar={() => (
        <div
          className="TileHeader"
          tabIndex={-1}
          onKeyDown={(e) => {
            switch (true) {
              case isShortcut("focus-query-field", e):
                setQueryFieldFocused(true);
                break;
              case isShortcut("blur-query-field", e):
                setQueryFieldFocused(false);
                break;
            }
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="TileLabel">
              <div className="TileLabel-Icon">
                {queryFieldFocused ? (
                  <SearchIcon />
                ) : isLoading || false ? (
                  <PageLoadProgressIndicator />
                ) : (
                  <Favicon source={favicons} />
                )}
              </div>
              {queryFieldFocused ? (
                <QueryField
                  focused={queryFieldFocused}
                  value={query}
                  onChange={setQuery}
                  onBlur={() => {
                    setQueryFieldFocused(false);
                  }}
                  onConfirm={(url) => {
                    setUrl(url);
                    setQuery(url);
                    webviewRef.current?.focus();
                  }}
                />
              ) : (
                <div className="TileLabel-Container" onClick={() => setQueryFieldFocused(true)}>
                  <CollapsibleText className="TileLabel-Title">{title}</CollapsibleText>
                  <DomainInfo url={url} />
                </div>
              )}
            </div>
            <div className="Toolbar">
              <ToolbarButton onClick={() => create({})}>+</ToolbarButton>
              <ToolbarButton onClick={() => split({ path, url: "muu" })}>split</ToolbarButton>
              <ToolbarButton onClick={() => webviewRef.current?.goBack()}>←</ToolbarButton>
              <ToolbarButton onClick={() => webviewRef.current?.goForward()}>→</ToolbarButton>
              <RemoveButton />
            </div>
          </div>
        </div>
      )}
    >
      <div className="Tile">
        <webview
          ref={webviewRef}
          className="WebView"
          disablewebsecurity
          // preload={`file://${__dirname}/preload.js`}
          onLoad={onLoad}
          src={url}
          style={{ flex: 1 }}
        ></webview>
      </div>
    </MosaicWindow>
  );
};
