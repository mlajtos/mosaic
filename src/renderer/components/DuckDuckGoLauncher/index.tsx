import React, { forwardRef } from "react";
import DockItem from "../DockItem";

import googleIcon from "./duckDuckGo.png";

export default forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <DockItem ref={ref}>
      <img src={googleIcon} />
    </DockItem>
  );
});
