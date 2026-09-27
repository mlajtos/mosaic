import React, { useEffect, useRef, useState } from "react";
import { useView } from "@danfessler/trellis-react";
import type { WebviewTag } from "electron";

import { useShortcut } from "../App/utils";
import Icon from "../Icon";

import Cross from "./cross.svg";
import "./style.css";
import { useEventListener } from "../WebviewTile/utils";

type FindInPageState = {
  isVisible: boolean;
  value: string;
  totalMatches?: number;
  activeMatch?: number;
};

export default ({ webviewRef }: { webviewRef: React.RefObject<WebviewTag | null> }) => {
  let inputRef = useRef<HTMLInputElement>(null);

  const [{ isVisible, value, totalMatches, activeMatch }, setState] = useState<FindInPageState>({
    isVisible: false,
    value: "",
  });
  const { focused: hasFocus } = useView();

  useShortcut(
    {
      "find-in-page": () => {
        if (hasFocus) {
          setState((state) => ({ ...state, isVisible: true }));
        }
      },
    },
    [hasFocus]
  );

  const on = useEventListener(webviewRef);
  on("found-in-page", ({ result: { matches, activeMatchOrdinal } }) => {
    setState((state) => ({ ...state, totalMatches: matches, activeMatch: activeMatchOrdinal }));
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        webviewRef.current?.findInPage(value, { forward: false });
        return;
      }

      webviewRef.current?.findInPage(value, { forward: true });
      return;
    }

    if (e.key === "Escape") {
      stop();
    }
  };

  useEffect(() => {
    if (value !== "") {
      webviewRef.current?.findInPage(value);
    } else {
      if (isVisible) {
        webviewRef.current?.stopFindInPage("clearSelection");
      }
    }
  }, [value, isVisible]);

  useEffect(() => {
    if (value === "") {
      setState((state) => ({
        ...state,
        totalMatches: undefined,
        activeMatch: undefined,
      }));
    }
  }, [value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, value: e.target.value }));
  };

  const stop = () => {
    setState((state) => ({
      ...state,
      isVisible: false,
      value: "",
      totalMatches: undefined,
      activeMatch: undefined,
    }));

    webviewRef.current?.stopFindInPage("clearSelection");
  };

  return (
    <div>
      {isVisible ? (
        <div className="FindInPageDialog">
          <input
            ref={inputRef}
            autoFocus
            value={value}
            placeholder="Find in page..."
            onKeyDown={onKeyDown}
            onChange={onChange}
          />
          {activeMatch ? (
            <div className="MatchInfo">
              <span>
                {activeMatch}/{totalMatches}
              </span>
            </div>
          ) : null}
          <button onClick={stop}>
            <Icon src={Cross} />
          </button>
        </div>
      ) : null}
    </div>
  );
};
