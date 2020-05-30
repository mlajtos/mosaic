import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import "./style.scss";

const dockOffset = 70;
const isVisible = (rect: ClientRect) =>
  !(rect.width === 0 && rect.height === 0 && rect.top === 0 && rect.left === 0);

export default ({ children }: { children: React.ReactNode }) => {
  const tileRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const [visible, setVisible] = useState(true);

  const observer = useCallback((node) => {
    if (node === null) {
      return;
    }

    // @ts-ignore
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const rect = entry.target.getBoundingClientRect();
        if (isVisible(rect)) {
          setRect(rect);
          setVisible(true);
        } else {
          // setRect(rect);
          setVisible(false);
        }
      }
    });

    resizeObserver.observe(node);
  }, []);

  const tileContainer = document.querySelector("#TileContainer");

  useEffect(
    () => () => {
      console.log("died");
    },
    []
  );

  return (
    <div className="TileProxy" ref={observer}>
      {ReactDOM.createPortal(
        <div
          ref={tileRef}
          className="Tile"
          style={{
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left - dockOffset,
            display: visible ? "flex" : "none",
          }}
        >
          {children}
        </div>,
        tileContainer!
      )}
    </div>
  );
};
