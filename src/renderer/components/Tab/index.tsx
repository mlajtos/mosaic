import React, { useEffect, useState } from "react";
import GoldenLayout from "golden-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";
import { useRecoilValue } from "recoil";
import PageState from "../PageState";
import CollapsibleText from "../CollapsibleText";
import ReactDOM from "react-dom";
import Favicon from "../Favicon";
import PageLoadProgressIndicator from "../PageLoadProgressIndicator";
import Space from "../Space";

const useForceUpdate = () => useState(null)[1];

export default ({ for: container }: { for: GoldenLayout.Container }) => {
  const forceUpdate = useForceUpdate();
  const { title, favicons, loading } = useRecoilValue(PageState);

  useEffect(() => {
    container.on("tab", forceUpdate);

    return () => {
      container.off("tab", forceUpdate);
    };
  }, []);

  if (!container.tab?.element[0]) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="Tab">
      {loading ? <PageLoadProgressIndicator /> : <Favicon source={favicons} />}
      <Space />
      <CollapsibleText>{title}</CollapsibleText>
      <Space />
      <div
        className="Close"
        onMouseDownCapture={(e) => {
          e.stopPropagation();
          container.close();
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </div>
    </div>,
    container.tab?.element[0]
  );
};
