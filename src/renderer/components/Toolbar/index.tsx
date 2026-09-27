import React from "react";

import "./style.css";

export default ({ children }: { children: React.ReactNode }) => {
  return <div className="Toolbar">{children}</div>;
};
