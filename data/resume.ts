import data from "./resume.json";

/**
 * `data/resume.json` is the single source of truth for every resume fact.
 * Nothing here is duplicated anywhere else in the app - the page, the public
 * /resume.json endpoint, and the CV drift checker all project from this file.
 *
 * A highlight is included in a renderer when its `targets` list contains that
 * renderer's key. `cvText` lets one fact carry a tighter wording for the
 * one-page Word CV without becoming a second, drifting copy of the fact.
 */
export type Target = "cv" | "web";

export type Highlight = {
  text: string;
  cvText?: string;
  targets: Target[];
};

export type Work = (typeof data)["work"][number];
export type Project = (typeof data)["projects"][number];
export type Skill = (typeof data)["skills"][number];

export const resume = data;
export const basics = data.basics;

/**
 * Optional second title ("Tech Lead") shown after the main one. Read defensively
 * so removing it from resume.json is enough - no code change needed, and the
 * separator disappears with it instead of dangling.
 */
export const secondaryLabel: string | undefined = (
  data.basics as { secondaryLabel?: string }
).secondaryLabel;
export const skills = data.skills;
export const education = data.education;
export const languages = data.languages;

/** Highlights for a given renderer, in source order, with the right wording. */
export function highlightsFor(
  highlights: readonly Highlight[] | undefined,
  target: Target,
): string[] {
  if (!highlights) return [];
  return highlights
    .filter((h) => (h.targets as readonly string[]).includes(target))
    .map((h) => (target === "cv" && h.cvText ? h.cvText : h.text));
}

/** Entries whose own `targets` include the renderer (defaults to included). */
function visible<T extends { targets?: readonly string[] }>(
  items: readonly T[],
  target: Target,
): T[] {
  return items.filter((i) => !i.targets || i.targets.includes(target));
}

export const work = data.work;
/** The job with no end date - drives the "Currently @" line in the hero. */
export const currentJob = data.work.find((j) => !j.endDate);
export const featuredProject = data.projects.find((p) => p.featured);
export const otherProjects = visible(data.projects, "web").filter(
  (p) => !p.featured,
);

/** "Apr 2023" from "2023-04". */
export function formatMonth(iso: string) {
  const [y, m] = iso.split("-");
  if (!m) return y;
  const month = new Date(Date.UTC(Number(y), Number(m) - 1, 1)).toLocaleString(
    "en-US",
    { month: "short", timeZone: "UTC" },
  );
  return `${month} ${y}`;
}

/** "Apr 2023 - Feb 2026" / "May 2026 - Present" */
export function formatPeriod(
  startDate: string | undefined,
  endDate?: string | null,
) {
  if (!startDate) return "";
  return `${formatMonth(startDate)} - ${endDate ? formatMonth(endDate) : "Present"}`;
}

/**
 * The public payload for /resume.json.
 *
 * CV-only contact details are not stripped here - they are not in this file at
 * all. They live in data/resume.private.json, which is gitignored and read only
 * by the sync script, so they can never reach the client bundle or the repo.
 */
export function publicResume() {
  const { summaryCv, ...publicBasics } = data.basics;
  return {
    $schema: "https://jsonresume.org/schema/",
    basics: publicBasics,
    work: data.work.map(({ highlights, ...rest }) => ({
      ...rest,
      highlights: highlightsFor(highlights as Highlight[], "web"),
    })),
    projects: visible(data.projects, "web").map(
      ({ highlights, summaryCv, targets, featured, ...rest }: any) => ({
        ...rest,
        highlights: highlightsFor(highlights as Highlight[], "web"),
      }),
    ),
    skills: data.skills,
    education: data.education,
    languages: data.languages,
  };
}
