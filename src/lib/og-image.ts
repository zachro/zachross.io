import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";
import type { OgPage } from "./og";

// Dark theme tokens from global.css.
const colors = {
  bg: "#111214",
  text: "#e8e8e6",
  muted: "#a6a6a3",
  accent: "#8ab4ff",
  border: "#2e3035",
};

// satori reads WOFF but not WOFF2. Builds run from the project root.
const fontDir = join(
  process.cwd(),
  "node_modules/@fontsource/jetbrains-mono/files",
);
const fonts = Promise.all(
  ([400, 700] as const).map(async (weight) => ({
    name: "JetBrains Mono",
    weight,
    style: "normal" as const,
    data: await readFile(
      join(fontDir, `jetbrains-mono-latin-${weight}-normal.woff`),
    ),
  })),
);

const favicon = readFile(join(process.cwd(), "public/favicon.svg")).then(
  (svg) => `data:image/svg+xml;base64,${svg.toString("base64")}`,
);

type Node = {
  type: string;
  props: {
    style?: Record<string, unknown>;
    children?: unknown;
    [k: string]: unknown;
  };
};
const h = (
  type: string,
  props: Node["props"],
  ...children: unknown[]
): Node => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children },
});

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function renderOgImage({ title, description }: OgPage) {
  const tree = h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: colors.bg,
        color: colors.text,
        fontFamily: "JetBrains Mono",
        borderBottom: `12px solid ${colors.accent}`,
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "24px" } },
      h("img", { src: await favicon, width: 64, height: 64 }),
      h("div", { style: { fontSize: 32, fontWeight: 700 } }, "zachross.io"),
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "div",
        {
          style: {
            fontSize: title.length > 32 ? 60 : 72,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          },
        },
        truncate(title, 60),
      ),
      h(
        "div",
        { style: { fontSize: 30, lineHeight: 1.45, color: colors.muted } },
        truncate(description, 140),
      ),
    ),
    h(
      "div",
      { style: { display: "flex", fontSize: 28, color: colors.muted } },
      "Zach Ross · Software Engineer",
    ),
  );

  // satori's types expect a ReactNode; a plain element tree is what it consumes.
  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: await fonts,
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
