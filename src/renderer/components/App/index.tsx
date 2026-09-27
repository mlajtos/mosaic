import { useRef } from "react";
import { Workspace, ViewType, View, type WorkspaceHandle } from "@danfessler/trellis-react";

import Dock from "../Dock";
import Surface from "../Surface";
import WebviewTile, { type PageParams } from "../WebviewTile";

import "@danfessler/trellis/style.css";
import "./style.scss";

import { useShortcut } from "./utils";

export default () => {
  const workspace = useRef<WorkspaceHandle>(null);

  useShortcut({
    "new-tab": () => {
      workspace.current?.open("webview", { params: { url: "about:blank" }, placement: "tab" });
    },
    "close-tab": () => {
      const { focusedView } = workspace.current?.getSnapshot() ?? {};
      if (focusedView) {
        workspace.current?.close(focusedView);
      }
    },
  });

  // dock items open as a new tile next to the focused one
  const launch = (url: string, from: Element) => {
    const { focusedPanel } = workspace.current?.getSnapshot() ?? {};
    workspace.current?.open("webview", {
      params: { url },
      placement: focusedPanel ? { beside: focusedPanel, edge: "right" } : "side",
      from,
    });
  };

  return (
    <div className="Container">
      <Dock onLaunch={launch} />
      <Surface>
        <Workspace
          ref={workspace}
          theme="dark"
          tokens={tokens}
          tabs={{ fill: true }}
          storageKey="mosaic"
          version={1}
          // hidden tiles would have nowhere to come back from
          panelMenu={(entries) => entries.filter((entry) => entry === "separator" || entry.id !== "hide")}
        >
          <ViewType<PageParams> id="webview" title="New tab">
            <WebviewTile />
          </ViewType>

          <View type="webview" params={{ url: "about:blank" }} />

          <Workspace.Empty>
            <div className="EmptyWorkspace">Press ⌘T or pick a site from the dock</div>
          </Workspace.Empty>
        </Workspace>
      </Surface>
    </div>
  );
};

const tokens = {
  "--trellis-bg": "rgb(34, 34, 34)",
};
