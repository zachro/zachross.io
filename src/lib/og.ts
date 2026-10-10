import { getPublishedProjects } from "./projects";

export type OgPage = {
  /** Path under /og/, without extension: "index", "about", "projects/foo". */
  slug: string;
  title: string;
  description: string;
};

/**
 * Every page that gets an OG image. BaseLayout only emits og:image for slugs
 * listed here, so a page missing from this list falls back to no image rather
 * than a broken one. Add new static pages here.
 */
export async function getOgPages(): Promise<OgPage[]> {
  const projects = await getPublishedProjects();
  return [
    {
      slug: "index",
      title: "Zach Ross",
      description: "Software engineer. See my projects and get in touch.",
    },
    {
      slug: "about",
      title: "About",
      description: "Background, experience, and how to get in touch.",
    },
    {
      slug: "projects",
      title: "Projects",
      description: "Things I've built, with notes on how and why.",
    },
    ...projects.map((project) => ({
      slug: `projects/${project.id}`,
      title: project.data.title,
      description: project.data.summary,
    })),
  ];
}

/** OG image slug for a page path: "/" -> "index", "/about" -> "about". */
export function ogSlugForPath(path: string) {
  return path === "/" ? "index" : path.replace(/^\//, "");
}
