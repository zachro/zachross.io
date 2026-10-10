import { getCollection } from "astro:content";

/** Published projects, newest first. Drafts never ship. */
export async function getPublishedProjects() {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * Year only, e.g. "2023". Frontmatter dates parse as UTC midnight, so read the
 * UTC year to avoid shifting into the previous year in western time zones.
 */
export function formatProjectDate(date: Date) {
  return String(date.getUTCFullYear());
}
