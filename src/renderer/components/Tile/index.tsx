import React, { useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";

import "./style.scss";
import { useEventListener } from "../OLD_Tile/utils";

const dockOffset = 70;

export default ({
  children,
  onKeyDown,
}: {
  children: React.ReactNode;
  onKeyDown: (e: KeyboardEvent) => void;
}) => {
  const [rect, setRect] = useState({ width: 0, height: 0, left: 0, top: 0 });

  const observer = useCallback((node) => {
    if (node === null) {
      return;
    }

    // @ts-ignore
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const rect = entry.target.getBoundingClientRect();
        console.log(rect);  
        setRect(rect);
      }
    });

    resizeObserver.observe(node);
  }, []);

  const tileContainer = document.querySelector("#TileContainer");

  const tileRef = useRef<HTMLDivElement>(null);

  const on = useEventListener(tileRef);
  on("keydown", onKeyDown);

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
          }}
        >
          {children}
        </div>,
        tileContainer!
      )}
    </div>
  );
};
