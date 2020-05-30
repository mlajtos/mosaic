import React, { useEffect, useRef, forwardRef } from "react";
import DockItem from "../DockItem";

import googleIcon from "./google.png";

export default forwardRef(({}, ref) => {
  return (
    <DockItem ref={ref}>
      <img src={googleIcon} style={{ pointerEvents: "none" }} />
    </DockItem>
  );
});
