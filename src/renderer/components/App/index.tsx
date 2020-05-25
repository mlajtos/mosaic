import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import GoldenLayout from "golden-layout";

// meh
window.ReactDOM = ReactDOM;
window.React = React;

import TileContainer from "../TileContainer";
import LayoutContainer, { getLayoutContainer } from "../LayoutContainer";
import Dock from "../Dock";
import WebviewTile from "../WebviewTile";
import GoogleLauncher from "../GoogleLauncher";
import Surface from "../Surface";

import "./style.scss";
import "./base.scss";
import "./dark-theme.scss";

import { useShortcut } from "./utils";
import Tab from "../Tab";

const TileConfig = () => ({
  title: "WebView",
  type: "component",
  componentName: "webview",
});

const config:GoldenLayout.Config = {
  dimensions: {
    headerHeight: 25
  },
  settings: {
    showPopoutIcon: false,
    showMaximiseIcon: false,
  },
  content: [
    {
      type: "stack",
      content: [TileConfig()],
    },
  ],
};

const wrapComponent = (Component: React.ComponentType<any>) => {
  return function (container: GoldenLayout.Container, state: any) {
    container.on("tab", (tab: GoldenLayout.Tab) => {
      ReactDOM.render(<Tab for={container} />, tab.element[0]);
    });

    const element = container.getElement()[0];
    ReactDOM.render(<WebviewTile {...{ container, state }} />, element);
  };
};

export default () => {
  const layout = useRef<GoldenLayout | null>(null);

  useEffect(() => {
    const goldenLayout = new GoldenLayout(config, getLayoutContainer());
    goldenLayout.registerComponent("webview", wrapComponent(WebviewTile));
    goldenLayout.init();

    goldenLayout.on("stateChanged", () => {
      //console.log(goldenLayout.toConfig());
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
      // const activeTile = findActiveTile(layout.current)
      // activeTile
    },
    "close-tab": () => {
      // FIX:
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
