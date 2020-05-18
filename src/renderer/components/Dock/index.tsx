import React from "react";

import "./style.scss";

export default ({ children }: { children?: React.ReactNode }) => {
  return <div id="Dock">{children}</div>;
};
