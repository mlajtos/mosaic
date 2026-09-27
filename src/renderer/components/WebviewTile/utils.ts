import { RefObject, useEffect, useSyncExternalStore } from "react";
import { useWorkspace } from "@danfessler/trellis-react";
import type { WebviewTag } from "electron";

export const useEventListener = (webViewRef: RefObject<WebviewTag | null>) => (
  eventName: string,
  listener: (...args: any[]) => void,
  options: boolean | undefined = undefined,
  deps: any[] = []
) => {
  useEffect(() => {
    if (webViewRef.current !== null) {
      webViewRef.current.addEventListener(eventName, listener, options);

      return () => {
        webViewRef.current?.removeEventListener(eventName, listener, options);
      };
    }

    return () => {};
  }, deps);
};

// the id is only available once the webview is attached
export const getWebContentsId = (webview: WebviewTag | null) => {
  try {
    return webview?.getWebContentsId();
  } catch {
    return undefined;
  }
};

// the view's slot in its tab, so the page can render its own favicon there
export const useTabIcon = (viewId: string) => {
  const workspace = useWorkspace();
  return useSyncExternalStore(
    (notify) => workspace.on("surfaces", notify),
    () => workspace.surfaces().find((surface) => surface.view.id === viewId)?.icon ?? null
  );
};
