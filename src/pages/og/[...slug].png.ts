import type { APIRoute, GetStaticPaths } from "astro";
import { getOgPages, type OgPage } from "../../lib/og";
import { renderOgImage } from "../../lib/og-image";

export const getStaticPaths = (async () => {
  const pages = await getOgPages();
  return pages.map((page) => ({ params: { slug: page.slug }, props: page }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<OgPage> = async ({ props }) => {
  const png = await renderOgImage(props);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
