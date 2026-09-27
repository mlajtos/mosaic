import React from "react";

import "./style.scss";

export default ({ icon, onClick }: { icon: string; onClick: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
  return (
    <div className="DockItem" onClick={onClick}>
      <img src={icon} />
    </div>
  );
};
