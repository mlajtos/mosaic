/// <reference types="vite/client" />

import type { MosaicApi } from "../preload";

declare global {
  interface Window {
    mosaic: MosaicApi;
  }
}
