import React, { forwardRef } from "react";

import "./style.scss";

export default forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => {
  return (
    <div ref={ref} className="DockItem" onClick={() => alert("Dock items can be opened by dragging them out of the dock.")}>
      {children}
    </div>
  );
});
