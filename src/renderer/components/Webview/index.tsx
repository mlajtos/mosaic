import type { Ref } from "react";
import type { WebviewTag } from "electron";

import "./style.css";

export default function ({ ref, src }: { ref: Ref<WebviewTag>; src: string }) {
  return (
    <webview
      ref={ref as Ref<HTMLWebViewElement>}
      className="Webview"
      src={src}
      webpreferences="scrollBounce,defaultEncoding=utf-8"
      // popups reach the main process, which opens them as tabs; React drops `true` for unknown attributes
      allowpopups={"true" as unknown as boolean}
    />
  );
}
