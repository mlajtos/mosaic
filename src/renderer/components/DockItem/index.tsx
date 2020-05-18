import React from "react";

import "./style.scss";

export default ({ children }: { children: React.ReactNode }) => {
  return <div className="DockItem">{children}</div>;
};
