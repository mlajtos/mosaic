import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";

export default ({ onClick }: { onClick: () => void }) => (
  <div
    className="TabCloseButton"
    onMouseDownCapture={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    <FontAwesomeIcon icon={faTimes} />
  </div>
);
