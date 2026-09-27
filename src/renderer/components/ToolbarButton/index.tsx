import React from "react";

import "./style.css";

export default ({ onClick, children }: { onClick: (e: React.MouseEvent) => void, children: React.ReactNode }) => {
  return (
    <button className="ToolbarButton" onClick={onClick}>
      <div>{children}</div>
    </button>
  );
};
