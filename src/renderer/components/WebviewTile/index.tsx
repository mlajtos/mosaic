import React, { useRef, useState, useEffect } from "react";

import QueryField from "../QueryField";
import Toolbar from "../Toolbar";
import DomainInfo from "../DomainInfo";
import Webview from "../Webview";
import Tile from "../Tile";
import ToolbarButton from "../ToolbarButton";
import PageTitle from "../PageTitle";

const defaultUrl = "https://google.com/";

export default ({ container }: { container: GoldenLayout.Container }) => {

  const webviewRef = useRef<HTMLWebViewElement>(null);
  const [query, setQuery] = useState(defaultUrl);
  const [url, setUrl] = useState(defaultUrl);
  const [queryHasFocus, setQueryHasFocus] = useState(false);
  return (
    <Tile>
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
            <div
              onClick={() => {
                setQueryHasFocus(true);
              }}
              style={{ marginLeft: "1rem" }}
            >
              <PageTitle>Aloha</PageTitle>
              <DomainInfo url={url} />
            </div>
            <ToolbarButton onClick={() => {}}>←</ToolbarButton>
            <ToolbarButton onClick={() => {}}>→</ToolbarButton>
          </>
        )}
      </Toolbar>
      <Webview $ref={webviewRef} url={url} />
    </Tile>
  );
};
