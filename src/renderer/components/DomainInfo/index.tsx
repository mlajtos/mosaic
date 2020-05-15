import React from "react";
import CollapsibleText from "../CollapsibleText";

import "./style.scss";

import locked from "./icons8-lock-26.png";
import unlocked from "./icons8-unlock-26.png";

export default ({ url }: { url: string }) => {
  try {
    const urlObject = new URL(url);
    const strippedHostname = urlObject.hostname.startsWith("www.")
      ? urlObject.hostname.replace(/^www./, "")
      : urlObject.hostname;
    const isSecure = urlObject.protocol === "https:";
    return (
      <div className="DomainInfo">
        <img className={isSecure ? "secure" : "insecure"} src={isSecure ? locked : unlocked} />
        <CollapsibleText className="Hostname">{strippedHostname}</CollapsibleText>
      </div>
    );
  } catch {
    return null;
  }
};
