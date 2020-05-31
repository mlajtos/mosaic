import React from "react";
import GoldenLayout from "golden-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";
import { useRecoilState } from "recoil";
import { textState } from "../App";
import CollapsibleText from "../CollapsibleText";

export default ({ for: container }: { for: GoldenLayout.Container }) => {

  const [text, setText] = useRecoilState(textState);
  
  return (
    <div className="Tab">
      {/* <div className="Title"></div> */}
      <CollapsibleText>{text}</CollapsibleText>
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
