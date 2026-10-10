import { getCollection } from "astro:content";

/** Published projects, newest first. Drafts never ship. */
export async function getPublishedProjects() {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  // Frontmatter dates parse as UTC midnight; format in UTC so they don't shift a day.
  timeZone: "UTC",
});

/** e.g. "Oct 2026" */
export function formatProjectDate(date: Date) {
  return monthYear.format(date);
}
