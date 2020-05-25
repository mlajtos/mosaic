import React from "react";
import GoldenLayout from "golden-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";

export default ({ for: container }: { for: GoldenLayout.Container }) => {
  return (
    <div className="Tab">
      <div className="Title">{container.title}</div>
      <div className="Space">&nbsp;</div>
      <div
        className="Close"
        onMouseDownCapture={(e) => {
          e.stopPropagation();
          container.close();
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </div>
    </div>
  );
};
