type TileConfig = {
  url: string;
  title: string;
  type: "component";
  componentName: "webview";
  header?: {
    show: false | "top" | "left" | "right" | "bottom";
  };
};

export default (props?: Partial<TileConfig>): TileConfig => ({
  url: "about:blank",
  ...props,
  title: "WebView",
  type: "component",
  componentName: "webview",
});
