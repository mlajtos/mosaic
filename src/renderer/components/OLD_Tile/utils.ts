import { RefObject, useEffect } from "react";

export const useEventListener = (webViewRef: RefObject<HTMLWebViewElement>) => (
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


export const zoomToFit = (el: HTMLElement) => (el.style.zoom = (el.clientWidth / el.scrollWidth).toString());