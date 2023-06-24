import type { Plugin } from "vite";

export default function BuildInfo(): Plugin {
  const moduleName = "virtual:build-info";

  return {
    name: moduleName,
    resolveId(id) {
      if (id === moduleName) {
        return `\0${id}`;
      }
    },
    load(id) {
      if (!id.startsWith("\0")) { return; }
      id = id.slice(1);
      if (id === moduleName) {
        return `export const time = new Date(${Date.now()});`;
      }
    },
  };
}

