type TileConfig = {
  url: string,
  title: string;
  type: "component";
  componentName: "webview";
};



export default (props?: Partial<TileConfig>): TileConfig => ({
  ...props,
  url: "https://google.com/",
  title: "WebView",
  type: "component",
  componentName: "webview",
});
