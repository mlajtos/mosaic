import React, { useRef, RefObject } from "react";
import useMergedRef from "@react-hook/merged-ref";
import { useShortcut } from "../App/utils";

import "./style.scss";

export default function ({ onFocus, $ref, url }: { $ref: RefObject<HTMLWebViewElement>; url: string }){
  const innerRef = useRef<HTMLWebViewElement | null>(null);
  const ref = useMergedRef($ref, innerRef);

  // https://github.com/electron/electron/issues/14258
  // useEffect(() => {
  //   if (innerRef.current === null) {
  //     console.log(":(");
  //     return;
  //   }
  //   innerRef.current?.getWebContents().on("before-input-event", (event, input) => {
  //     if (["keyDown", "keyUp"].includes(input.type)) {
  //       const emulatedKeyboardEvent = new KeyboardEvent(input.type.toLowerCase(), {
  //         code: input.code,
  //         key: input.key,
  //         shiftKey: input.shift,
  //         altKey: input.alt,
  //         ctrlKey: input.control,
  //         metaKey: input.meta,
  //         repeat: input.isAutoRepeat,
  //         bubbles: true,
  //       });

  //       innerRef.current?.dispatchEvent(emulatedKeyboardEvent);
  //     }
  //   });
  // }, [innerRef]);
/*
  useShortcut({
    "find-in-page": () => {
      const { current } = innerRef
      console.log(innerRef)
    }
  })
*/
  return (
    <webview ref={ref} className="Webview" src={url} webpreferences="scrollBounce,defaultEncoding=utf-8" />
  );
};
