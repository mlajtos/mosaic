import React from "react";
import CollapsibleText from "../CollapsibleText";

import "./style.scss";

export default ({ children: title }: { children: string }) => {
  return (
    <div className="PageTitle">
      <CollapsibleText>{title}</CollapsibleText>
    </div>
  );
};
