import { RefObject, useEffect } from "react";

export const useEventListener = (webViewRef: RefObject<HTMLWebViewElement>) => (
  eventName: string,
  listener: (...args: any[]) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    if (webViewRef.current !== null) {
      webViewRef.current.addEventListener(eventName, listener);

      return () => {
        webViewRef.current?.removeEventListener(eventName, listener);
      };
    }

    return () => {};
  }, deps);
};


export const zoomToFit = (el: HTMLElement) => (el.style.zoom = (el.clientWidth / el.scrollWidth).toString());