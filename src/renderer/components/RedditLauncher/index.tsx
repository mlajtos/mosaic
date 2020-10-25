import React, { forwardRef } from "react";
import DockItem from "../DockItem";

import redditIcon from "./reddit.png";

export default forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <DockItem ref={ref}>
      <img src={redditIcon} />
    </DockItem>
  );
});
