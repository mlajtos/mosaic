import React from "react";
import CollapsibleText from "../CollapsibleText";
import Icon from "../Icon";

import "./style.css";

import locked from "./icons8-lock-26.png";
import unlocked from "./icons8-unlock-26.png";
import search from "./icons8-search.png";

export default ({ url }: { url: string }) => {
  try {
    const urlObject = new URL(url);
    const strippedHostname = urlObject.hostname.startsWith("www.")
      ? urlObject.hostname.replace(/^www./, "")
      : urlObject.hostname;
    const isSecure = urlObject.protocol === "https:";

    const isBlank = url === "about:blank";

    return (
      <div className={`DomainInfo`}>
        {isBlank ? (
          <>
            <Icon src={search} />
            <CollapsibleText>Search…</CollapsibleText>
          </>
        ) : (
          <>
            <img className={isSecure ? "secure" : "insecure"} src={isSecure ? locked : unlocked} />
            <CollapsibleText>{strippedHostname}</CollapsibleText>
          </>
        )}
      </div>
    );
  } catch (e) {
    return null;
  }
};
