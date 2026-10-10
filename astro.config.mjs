// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://zachross.io",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
    // Always emit CSS as files: inline <style> tags would each need a CSP hash.
    inlineStylesheets: "never",
  },
  integrations: [mdx(), sitemap()],
});
