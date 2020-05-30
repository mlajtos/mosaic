import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import GoldenLayout from "golden-layout";
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from "recoil";

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

const TileConfig = () => ({
  title: "WebView",
  type: "component",
  componentName: "webview",
});

export const textState = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

const config: GoldenLayout.Config = {
  dimensions: {
    headerHeight: 25,
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

const WebtileComponent = function (container: GoldenLayout.Container, state: any) {
  container.on("close", () => {
    ReactDOM.unmountComponentAtNode(container.getElement()[0]);
  });

  const element = container.getElement()[0];
  ReactDOM.render(
    <RecoilRoot>
      <WebviewTile {...{ container, state }} />
    </RecoilRoot>,
    element
  );
};

export default () => {
  const layout = useRef<GoldenLayout | null>(null);
  const googleLauncher = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const goldenLayout = new GoldenLayout(config, getLayoutContainer());
    goldenLayout.registerComponent("webview", WebtileComponent);
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

  useEffect(() => {
    layout.current?.createDragSource(googleLauncher.current, TileConfig());
  }, []);

  return (
    <div className="Container">
      <Dock>
        <GoogleLauncher ref={googleLauncher} />
      </Dock>
      <Surface>
        <LayoutContainer />
        <TileContainer />
      </Surface>
    </div>
  );
};
