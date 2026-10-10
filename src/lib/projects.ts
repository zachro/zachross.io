import { getCollection } from "astro:content";

/** Published projects, newest first. Drafts never ship. */
export async function getPublishedProjects() {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
