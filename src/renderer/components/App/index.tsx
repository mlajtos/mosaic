import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import GoldenLayout from "golden-layout";
import { RecoilRoot } from "recoil";

import TileContainer from "../TileContainer";
import LayoutContainer, { getLayoutContainer } from "../LayoutContainer";
import Dock from "../Dock";
import WebviewTile from "../WebviewTile";
import Surface from "../Surface";
import GoogleLauncher from "../GoogleLauncher";
import DuckDuckGoLauncher from "../DuckDuckGoLauncher";
import WikipediaLauncher from "../WikipediaLauncher";

import "./style.scss";
import "./base.scss";
import "./dark-theme.scss";

import { useShortcut } from "./utils";

import DefaultTileConfig from "../DefaultTileConfig";
import RedditLauncher from "../RedditLauncher";

const config: GoldenLayout.Config = {
  dimensions: {
    headerHeight: 25,
  },
  settings: {
    showPopoutIcon: false,
    showMaximiseIcon: false,
    // @ts-ignore
    responsiveMode: 'none',
    // HACK: prevent GoldenLayout to hide tabs that would not fit, instead rely on the flexbox
    tabControlOffset: -1000

  },
  content: [
    {
      type: "stack",
      content: [DefaultTileConfig()],
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

  const googleLauncher = useRef<HTMLDivElement | null>(null);
  const duckDuckGoLauncher = useRef<HTMLDivElement | null>(null);
  const wikipediaLauncher = useRef<HTMLDivElement | null>(null);
  const redditLauncher = useRef<HTMLDivElement | null>(null);

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
      DefaultTileConfig({ url: "https://google.com/" })
    );

    layout.current?.createDragSource(
      duckDuckGoLauncher.current,
      DefaultTileConfig({ url: "https://duckduckgo.com/" })
    );

    layout.current?.createDragSource(
      wikipediaLauncher.current,
      DefaultTileConfig({ url: "https://wikipedia.org" })
    );

    layout.current?.createDragSource(
      redditLauncher.current,
      DefaultTileConfig({ url: "https://reddit.com" })
    );
  }, []);

  return (
    <div className="Container">
      <Dock>
        <GoogleLauncher ref={googleLauncher} />
        <DuckDuckGoLauncher ref={duckDuckGoLauncher} />
        <RedditLauncher ref={redditLauncher} />
        <WikipediaLauncher ref={wikipediaLauncher} />
      </Dock>
      <Surface>
        <LayoutContainer />
        <TileContainer />
      </Surface>
    </div>
  );
};
