import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";

// policy for Mosaic's own page; web pages live in webviews and keep their own
const contentSecurityPolicy = (development: boolean) =>
  [
    "default-src 'self'",
    // Vite's React refresh runs an inline script during development
    `script-src 'self'${development ? " 'unsafe-inline'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    // favicons come from any site
    "img-src 'self' data: http: https:",
  ].join("; ");

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    plugins: [
      react(),
      {
        name: "content-security-policy",
        transformIndexHtml: (_html, { server }) => [
          {
            tag: "meta",
            attrs: { "http-equiv": "Content-Security-Policy", content: contentSecurityPolicy(!!server) },
            injectTo: "head-prepend",
          },
        ],
      },
    ],
  },
});
