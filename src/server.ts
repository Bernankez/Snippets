import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { createApp, createError, eventHandler, fromNodeMiddleware, setHeader, toNodeListener } from "h3";
import { listen } from "listhen";
import type { ViteDevServer } from "vite";

const isProd = process.env.NODE_ENV === "production";

const root = process.cwd();

// TODO compile server.ts
async function createServer() {
  const app = createApp();

  const templateProd = isProd ? readFileSync(resolve(root, "./dist/client/index.html"), "utf-8") : "";
  const ssrManifest = isProd ? readFileSync(resolve(root, "./dist/client/ssr-manifest.json"), "utf-8") : "";

  let vite: ViteDevServer;
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(fromNodeMiddleware(vite.middlewares));
  } else {
    const compression = (await import("compression")).default;
    const serveStatic = (await import("serve-static")).default;
    app.use(fromNodeMiddleware(() => compression()));
    app.use(fromNodeMiddleware(serveStatic(resolve(root, "./dist/client"), { index: false })));
  }

  app.use("*", eventHandler(async (event) => {
    const { path } = event;
    try {
      let template: string;
      let render: () => Promise<{ app: string; hydration: string }>;
      if (!isProd) {
        template = readFileSync(resolve(root, "./index.html"), "utf-8");
        template = await vite.transformIndexHtml(path, template);
        render = (await vite.ssrLoadModule(resolve(root, "./src/entry-server.ts"))).render;
      } else {
        template = templateProd;
        render = (await import(resolve(root, "./dist/server/entry-server.js"))).render;
      }

      const { app, hydration } = await render();
      const html = template.replace("<!--ssr-head-->", hydration).replace("<!--ssr-body-->", app);
      setHeader(event, "Content-Type", "text/html");
      return html;
    } catch (_e) {
      const e = _e as Error;
      vite.ssrFixStacktrace(e);
      throw createError({
        statusCode: 500,
        message: e.stack,
      });
    }
  }));

  listen(toNodeListener(app));
}

createServer();
