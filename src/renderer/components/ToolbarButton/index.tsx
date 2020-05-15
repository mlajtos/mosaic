import React from "react";

import "./style.scss";

export default ({ onClick, children }: { onClick: (e: React.MouseEvent) => void, children: React.ReactNode }) => {
  return (
    <button className="ToolbarButton" onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};
