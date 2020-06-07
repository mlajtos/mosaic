import React from "react";

import "./style.scss";

type Props = { children: string };

// export default ({ children }: Props) => <input className="CollapsibleText" defaultValue={children} />;
export default ({ children }: Props) => <div className="CollapsibleText">{children}</div>;
