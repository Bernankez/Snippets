import { defineConfig, presetIcons, presetUno, transformerDirectives } from "unocss";
/* eslint-disable unused-imports/no-unused-imports */
import type { UserConfig } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  transformers: [transformerDirectives()],
});
