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
import Tile from "../Tile";
import TileFocusState from "../TileFocusState";

const config: GoldenLayout.Config = {
  dimensions: {
    headerHeight: 25,
  },
  settings: {
    showPopoutIcon: false,
    showMaximiseIcon: false,
    // @ts-ignore
    responsiveMode: "none",
    // HACK: prevent GoldenLayout to hide tabs that would not fit, instead rely on the flexbox
    tabControlOffset: -1000,
  },
  content: [
    {
      type: "stack",
      content: [DefaultTileConfig()],
    },
  ],
  // content: [{"type":"stack","content":[{"url":"https://wikipedia.org","title":"WebView", "state" : ,"type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true},{"url":"https://wikipedia.org","title":"WebView","type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true},{"url":"https://reddit.com","title":"WebView","type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true},{"url":"https://duckduckgo.com/","title":"WebView","type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true},{"url":"https://out.reddit.com/t3_hkzxpm?app_name=web2x&token=AQAALmYAXwCPZgzaFBVHu-JZnowDe9TLw7qhbtKO_D-p00-osxa8&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DnkGiFpJC9LM&user_id=14496312","title":"WebView","type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true},{"url":"https://wikipedia.org","title":"WebView","type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true},{"url":"https://out.reddit.com/t3_hkz040?app_name=web2x&token=AQAALmYAX2aDU5y7HWxGk5ZMLiHGDbIG_O30WemVxTUUljX5IZyF&url=https%3A%2F%2Fi.imgur.com%2FKha5lEk.jpg&user_id=14496312","title":"WebView","type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true},{"url":"https://out.reddit.com/t3_hkw7ts?app_name=web2x&token=AQAALmYAX-D7uZUpWZy4i5Ax5mxGE6QyOvLiiIyLBJweNi8kLEnk&url=https%3A%2F%2Fi.imgur.com%2FrL3t29H.gifv&user_id=14496312","title":"WebView","type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true},{"url":"about:blank","title":"WebView","type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true},{"url":"about:blank","title":"WebView","type":"component","componentName":"webview","isClosable":true,"reorderEnabled":true}],"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":6,"width":100,"height":100}]
};

const WebtileComponent = function (container: GoldenLayout.Container, state: any) {
  const element = container.getElement()[0];

  container.on("destroy", () => {
    ReactDOM.unmountComponentAtNode(element);
  });

  ReactDOM.render(
    <RecoilRoot>
      <Tile {...TileFocusState}>
        <WebviewTile {...{ container, state }} />
      </Tile>
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
      const targetContainer = TileFocusState.getLastFocusedTile()?.parentNode!;
      const root = layout.current?.root!;

      const targetItems = root.getItemsByFilter((item) => {
        // BUG in GL: `ContentItem.element` is for some reason of type `GoldenLayout.Container`
        // @ts-ignore
        const containerElement: Element = item.element[0];
        return item.isStack && containerElement.contains(targetContainer);
      });

      const targetItem = targetItems?.[0];
      targetItem.addChild(DefaultTileConfig());
    },
    "close-tab": () => {
      const targetContainer = TileFocusState.getLastFocusedTile()?.parentNode;
      const root = layout.current?.root!;

      const targetItems = root.getItemsByFilter((item) => {
        // BUG in GL: `ContentItem.element` is for some reason of type `GoldenLayout.Container`
        // @ts-ignore
        const containerElement: Element = item.element[0];
        return containerElement.firstChild === targetContainer;
      });

      const targetItem = targetItems?.[0];
      targetItem.remove();
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
