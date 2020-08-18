import React, { useEffect, useState } from "react";
import GoldenLayout from "golden-layout";
import { useRecoilValue } from "recoil";

import PageState from "../PageState";
import CollapsibleText from "../CollapsibleText";
import ReactDOM from "react-dom";
import Favicon from "../Favicon";
import PageLoadProgressIndicator from "../PageLoadProgressIndicator";
import Space from "../Space";
import Spacer from "../Spacer";
import TabCloseButton from "../TabCloseButton";

import "./style.scss";
import TabState from "../TabState";

const useForceUpdate = () => useState(null)[1];
const HStack = ({
  style,
  ...props
}: {
  style?: JSX.IntrinsicElements["div"]["style"];
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        transition: "flex 1s ease",
        overflow: "hidden",
        ...style,
      }}
      {...props}
    />
  );
};
export default ({ for: container }: { for: GoldenLayout.Container }) => {
  const forceUpdate = useForceUpdate();
  const { title, favicons, loading } = useRecoilValue(PageState);
  const { hasFocus } = useRecoilValue(TabState);

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
    <div className={`Tab ${hasFocus ? " focused" : ""}`}>
      <HStack>
        <TabCloseButton
          onClick={() => {
            container.close();
          }}
        />
        <Spacer />
      </HStack>
      <HStack
        style={{
          flex: 4,
        }}
      >
        {loading ? <PageLoadProgressIndicator /> : <Favicon source={favicons} />}
        <Space />
        <CollapsibleText>{title}</CollapsibleText>
      </HStack>
      <HStack>
        <Spacer />
      </HStack>
    </div>,
    container.tab?.element[0]
  );
};
