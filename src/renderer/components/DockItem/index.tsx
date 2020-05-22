import React, { forwardRef } from "react";

import "./style.scss";

export default forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => {
  return (
    <div ref={ref} className="DockItem">
      {children}
    </div>
  );
});
