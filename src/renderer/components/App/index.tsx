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
import GoogleLauncher from "../GoogleLauncher";
import Surface from "../Surface";

const TileConfig = () => ({
  title: "WebView",
  type: "react-component",
  component: "webview",
})

const useShortcut = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    ipcRenderer.on("shortcut", (event, shortcutName) => {
      shortcuts?.[shortcutName]?.();
    });
  }, []);
};

const config = {
  settings: {
    showPopoutIcon: false,
    showMaximiseIcon: false,
  },
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






  useShortcut({
    "new-tab": () => {
      // FIX: actually new top-level child, not new tab
      layout.current?.root.contentItems[0].addChild(TileConfig());
    },
    "close-tab": () => {
      // remove active
      layout.current?.root.contentItems[0].addChild(TileConfig());
      layout.current?.root.contentItems[0].addChild(TileConfig());
      layout.current?.root.contentItems[0].addChild(TileConfig());
    },
  });

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
