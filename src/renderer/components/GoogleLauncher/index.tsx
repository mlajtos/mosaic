import React, { useEffect, useRef } from "react";
import DockItem from "../DockItem";

import googleIcon from "./google.png";

export default ({ layout }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("muuuuuuu", layout.current, ref.current)
    if (layout.current !== null && ref.current !== null) {
      console.log("kmsdkamskmdkamsdkaksm", layout.current, ref.current)
      layout.current?.createDragSource(ref.current, {
        title: "WebView",
        type: "react-component",
        component: "webview",
      });
    }
  }, [ref, layout]);

  return (
    <DockItem ref={ref}>
      <img src={googleIcon} />
    </DockItem>
  );
};
