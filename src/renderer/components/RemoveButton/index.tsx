import React, { useContext } from "react";
import { MosaicContext, MosaicWindowContext } from "react-mosaic-component";

import ToolbarButton from "../ToolbarButton";

export default () => {
  const { mosaicActions } = useContext(MosaicContext);
  const { mosaicWindowActions } = useContext(MosaicWindowContext);
  {
    return (
      <ToolbarButton
        onClick={() => {
          mosaicActions.remove(mosaicWindowActions.getPath());
        }}
      >
        ✕
      </ToolbarButton>
    );
  }
};
