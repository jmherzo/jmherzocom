import { publicResume } from "@/data/resume";

/**
 * Machine-readable resume for AI agents, recruiter tooling and crawlers.
 * Same facts as the page - both project from data/resume.json.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(publicResume(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
