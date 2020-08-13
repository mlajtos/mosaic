import React, { useRef, useState, useEffect } from "react";
import GoldenLayout from "golden-layout";
import {atom, selector, useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';

import QueryField from "../QueryField";
import Toolbar from "../Toolbar";
import DomainInfo from "../DomainInfo";
import Webview from "../Webview";
import Tile from "../Tile";
import ToolbarButton from "../ToolbarButton";
import PageState from "../PageState";
import Tab from "../Tab";
import Finder from '../Finder'

import { useEventListener } from "./utils";
import { remote } from "electron";
import DefaultTileConfig from "../DefaultTileConfig";

const Space = () => <div style={{ width: "0.5rem" }} />;

let focusedWebview

export default ({ container, state }: { container: GoldenLayout.Container; state: any }) => {
  const webviewRef = useRef<HTMLWebViewElement>(null);
  const [queryHasFocus, setQueryHasFocus] = useState(true);

  const [{ url, query }, setPageState] = useRecoilState(PageState);

  useEffect(() => {
    // @ts-ignore
    setPageState((page) => ({ ...page, url: container._config.url }));
    focusedWebview = webviewRef.current
  }, []);

  const on = useEventListener(webviewRef);

  on("did-start-loading", () => setPageState((page) => ({ ...page, loading: true })));
  on("did-stop-loading", () => setPageState((page) => ({ ...page, loading: false })));
  on("page-favicon-updated", ({ favicons }) => setPageState((page) => ({ ...page, favicons })));
  on("will-navigate", ({ url }) => {
    setPageState((state) => ({ ...state, url, favicons: [], query: url }));
  });
  on("will-navigate", ({ url }) => setPageState((page) => ({ ...page, url })));
  on("new-window", ({ url, disposition }) => {
    // open new tab
    const newTab = DefaultTileConfig({ url });
    container.parent.parent.addChild(newTab);
    if (disposition === "foreground-tab") {
      container.parent.parent.setActiveContentItem(
        container.parent.parent.contentItems[container.parent.parent.contentItems.length - 1]
      );
    } else {
      container.parent.parent.setActiveContentItem(container.parent);
    }
  });

  on("page-title-updated", ({ title }) => setPageState((page) => ({ ...page, title })));
  on("did-stop-loading", async (e) => {
    const webContentsId = e.target.getWebContentsId();
    const webContents = remote.webContents.fromId(webContentsId);
    const zoomFactor = await webContents.executeJavaScript(
      "document.documentElement.clientWidth / document.documentElement.scrollWidth"
    );
    
    if (zoomFactor > 0) {
      webContents.zoomFactor = zoomFactor;
    }
    // setPageState(page => ({ ...page, url: e.target.contentWindow.location.href}));
    // setPageState(page => ({ ...page, query: e.target.contentWindow.location.href}));
  });

  return (
    <Tile>
      <Tab for={container} onClick={()=>  focusedWebview = webviewRef.current}/>
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
        <Finder container={container} getState={() => focusedWebview} webviewRef={webviewRef}/>
      </Toolbar>
      <Webview $ref={webviewRef} url={url} onFocus={()=>  focusedWebview = webviewRef.current}/>
    </Tile>
  );
};
