import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import GoldenLayout from "golden-layout";
import { ipcRenderer } from "electron";

// meh
window.ReactDOM = ReactDOM;
window.React = React;

import TileContainer from "../TileContainer";
import LayoutContainer, { getLayoutContainer } from "../LayoutContainer";
import Dock from "../Dock";
import WebviewTile from "../WebviewTile";

import "./style.scss";
import "./base.scss";
import "./dark-theme.scss";
import { useEventListener } from "../OLD_Tile/utils";
import { isShortcut } from "./utils";
import GoogleLauncher from "../GoogleLauncher";
import Surface from "../Surface";

const config = {
  content: [
    {
      type: "stack",
      content: [
        {
          title: "WebView",
          type: "react-component",
          component: "webview",
        },
      ],
    },
  ],
};

export default () => {
  const layout = useRef<GoldenLayout | null>(null);

  useEffect(() => {
    const goldenLayout = new GoldenLayout(config, getLayoutContainer());
    goldenLayout.registerComponent("webview", WebviewTile);
    goldenLayout.init();

    goldenLayout.on("stateChanged", () => {
      console.log(goldenLayout.toConfig());
    });

    layout.current = goldenLayout;
  }, []);

  useEffect(() => {
    const onResizeWindow = () => {
      layout.current?.updateSize();
    };
    window.addEventListener("resize", onResizeWindow);

    return () => {
      window.removeEventListener("resize", onResizeWindow);
    };
  }, []);

  const docRef = useRef(document);
  const on = useEventListener(docRef);
  on(
    "keydown",
    (e) => {
      console.log(e);
      switch (true) {
        case isShortcut("new-tab", e): {
          const newItemConfig = {
            title: "WebView",
            type: "react-component",
            component: "webview",
          };
          layout.current?.root.contentItems[0].addChild(newItemConfig);
          break;
        }
        case isShortcut("history-back", e): {
          console.log("back");
          break;
        }
      }
    },
    true
  );

  return (
    <div className="Container">
      <Dock>
        <GoogleLauncher layout={layout} />
      </Dock>
      <Surface>
        <LayoutContainer />
        <TileContainer />
      </Surface>
    </div>
  );
};
