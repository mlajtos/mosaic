import React, { useRef, useEffect, RefObject } from "react";

import "./style.scss";

export default ({ $ref }: { $ref: RefObject<HTMLWebViewElement> }) => {
  const innerRef = useRef<HTMLWebViewElement | null>(null);

  // https://github.com/electron/electron/issues/14258
  useEffect(() => {
    if (innerRef.current === null) {
      console.log(":(");
      return;
    }
    innerRef.current?.getWebContents().on("before-input-event", (event, input) => {
      if (["keyDown", "keyUp"].includes(input.type)) {
        const emulatedKeyboardEvent = new KeyboardEvent(input.type.toLowerCase(), {
          code: input.code,
          key: input.key,
          shiftKey: input.shift,
          altKey: input.alt,
          ctrlKey: input.control,
          metaKey: input.meta,
          repeat: input.isAutoRepeat,
          bubbles: true,
        });

        innerRef.current?.dispatchEvent(emulatedKeyboardEvent);
      }
    });
  }, [innerRef]);

  return (
    <webview
      ref={innerRef}
      className="Webview"
      src={`https://google.com/`}
      webpreferences="scrollBounce,defaultEncoding=utf-8"
    />
  );
};
