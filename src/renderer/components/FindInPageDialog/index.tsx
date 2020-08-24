import React, { useEffect, useRef } from "react";
import { useRecoilState, atom } from "recoil";

import TileState from "../TileState";
import { useShortcut } from "../App/utils";

import Cross from "./cross.svg";
import "./style.scss";
import { useEventListener } from "../WebviewTile/utils";

const FindInPageState = atom({
  key: "findInPageState",
  default: {
    isVisible: false,
    value: "",
    totalMatches: undefined,
    activeMatch: undefined,
  },
});

export default ({ webviewRef }: { webviewRef: React.RefObject<HTMLWebViewElement> }) => {
  let inputRef = useRef<HTMLInputElement>(null);

  const [{ isVisible, value, totalMatches, activeMatch }, setState] = useRecoilState(FindInPageState);
  const [{ hasFocus }] = useRecoilState(TileState);

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
        // @ts-ignore
        webviewRef.current?.findInPage(value, { forward: false });
        return;
      }

      // @ts-ignore
      webviewRef.current?.findInPage(value, { forward: true });
      return;
    }

    if (e.key === "Escape") {
      stop();
    }
  };

  useEffect(() => {
    if (value !== "") {
      // @ts-ignore
      webviewRef.current?.findInPage(value);
    } else {
      if (isVisible) {
        // @ts-ignore
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

    // @ts-ignore
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
            <img src={Cross} />
          </button>
        </div>
      ) : null}
    </div>
  );
};
