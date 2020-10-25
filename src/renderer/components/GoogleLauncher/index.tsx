import React, { forwardRef } from "react";
import DockItem from "../DockItem";

import googleIcon from "./google.png";

export default forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <DockItem ref={ref}>
      <img src={googleIcon} />
    </DockItem>
  );
});
