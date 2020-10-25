import React, { forwardRef } from "react";
import DockItem from "../DockItem";

import icon from "./icon.png";

export default forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <DockItem ref={ref}>
      <img src={icon} />
    </DockItem>
  );
});
