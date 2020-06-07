import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import GoldenLayout from "golden-layout";
import { RecoilRoot } from "recoil";

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

import DefaultTileConfig from "../DefaultTileConfig";

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
      content: [DefaultTileConfig({ url: "https://google.com/"})],
    },
  ],
};

const WebtileComponent = function (container: GoldenLayout.Container, state: any) {
  const element = container.getElement()[0];

  container.on("close", () => {
    ReactDOM.unmountComponentAtNode(element);
  });

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
      // TODO: persistance
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
      layout.current?.root.contentItems[0].addChild(DefaultTileConfig());
      // const activeTile = findActiveTile(layout.current)
      // activeTile
    },
    "close-tab": () => {
      alert("TODO: ⌘W to close tab");
    },
  });

  useEffect(() => {
    layout.current?.createDragSource(
      googleLauncher.current,
      DefaultTileConfig()
    );
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
