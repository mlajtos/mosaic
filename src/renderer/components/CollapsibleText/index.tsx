import React from "react";

import "./style.scss";

type Props = { children: string; className?: string };

export default ({ children, className }: Props) => (
  <input className={`CollapsibleText ${className ?? ""}`} value={children} />
);
