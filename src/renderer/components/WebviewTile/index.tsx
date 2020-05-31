import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import GoldenLayout from "golden-layout";
import { useRecoilState } from "recoil";

import QueryField from "../QueryField";
import Toolbar from "../Toolbar";
import DomainInfo from "../DomainInfo";
import Webview from "../Webview";
import Tile from "../Tile";
import ToolbarButton from "../ToolbarButton";
import PageTitle from "../PageTitle";
import Favicon from "../Favicon";
import { textState } from "../App";
import Tab from "../Tab";

import { useEventListener } from "./utils";

const defaultUrl = "https://google.com/";
const Space = () => <div style={{ width: "0.5rem" }} />;

export default ({ container }: { container: GoldenLayout.Container }) => {
  const webviewRef = useRef<HTMLWebViewElement>(null);
  const [query, setQuery] = useState(defaultUrl);
  const [url, setUrl] = useState(defaultUrl);
  const [queryHasFocus, setQueryHasFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favicons, setFavicons] = useState([]);

  const [text, setText] = useRecoilState(textState);

  const on = useEventListener(webviewRef);

  on("did-start-loading", () => setIsLoading(true));
  on("did-stop-loading", () => setIsLoading(false));
  on("page-favicon-updated", ({ favicons }) => setFavicons(favicons));
  on("will-navigate", ({ url }) => {
    setFavicons([]);
    setUrl(url);
    setQuery(url);
  });
  on("will-navigate", ({ url }) => setUrl(url));
  on("new-window", ({ url }) => {});

  on("page-title-updated", ({ title }) => setText(title));



  return (
    <Tile>
      {container.tab?.element[0] ? ReactDOM.createPortal(<Tab for={container} />, container.tab?.element[0]) : null}
      <Toolbar>
        {queryHasFocus ? (
          <QueryField
            value={query}
            onChange={setQuery}
            onConfirm={(url) => {
              console.log("Url:", url);
              setQuery(url);
              setUrl(url);
              setQueryHasFocus(false);
            }}
            focused={queryHasFocus}
            onBlur={() => {
              setQueryHasFocus(false);
            }}
          />
        ) : (
          <>
            <Space />
            <Favicon source={favicons} />
            <Space />
            <div
              onClick={() => {
                setQueryHasFocus(true);
              }}
            >
              <PageTitle>{text}</PageTitle>
              <DomainInfo url={url} />
            </div>
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
          </>
        )}
      </Toolbar>
      <Webview $ref={webviewRef} url={url} />
    </Tile>
  );
};
