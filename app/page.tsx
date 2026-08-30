"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Briefcase,
  User,
  GraduationCap,
  Calendar,
  Moon,
  Sun,
  Copy,
  Check,
  Contact,
  Star,
  Menu,
  X,
} from "lucide-react";
import {
  basics,
  secondaryLabel,
  work,
  currentJob,
  featuredProject,
  otherProjects,
  skills,
  education,
  languages,
  highlightsFor,
  formatMonth,
  type Highlight,
} from "@/data/resume";

const email = basics.email;

const NAV = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];


/**
 * `<time datetime>` accepts a single date, never a range, so a period is two
 * separate <time> elements. An open-ended role has no end date to mark up.
 */
function Period({
  start,
  end,
}: {
  start?: string;
  end?: string | null;
}) {
  if (!start) return null;
  return (
    <>
      <time dateTime={start}>{formatMonth(start)}</time>
      {" - "}
      {end ? <time dateTime={end}>{formatMonth(end)}</time> : "Present"}
    </>
  );
}

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // The inline script in the layout has already applied the theme before
  // paint; this just syncs React to whatever it decided. `mounted` keeps the
  // icon from rendering until then, so the markup cannot mismatch on hydration.
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
    setMounted(true);
  }, []);

  useEffect(
    () => () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    },
    [],
  );

  // Close the mobile menu on Escape, on an outside click, and whenever the
  // viewport grows past the breakpoint where the desktop nav takes over -
  // otherwise it stays open behind the desktop layout after a rotate/resize.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => mq.matches && setMenuOpen(false);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    mq.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      mq.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Copy email function
  // navigator.clipboard is undefined outside a secure context, and writeText
  // rejects when the permission is denied. Both used to leave an unhandled
  // rejection behind while the button still claimed "Copied".
  const copyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(email);
      setCopied(true);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopyFailed(false), 4000);
    }
  };

  const [firstName, ...restName] = basics.name.split(" ");

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-primary focus:px-4 focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        data-menu-open={menuOpen}
        className="site-header fixed top-0 z-40 w-full border-b transition-colors duration-300"
      >
        <div className="container flex h-16 items-center justify-between">
          {/* -ml-2.5 keeps the 44px hit area from pushing the logo off the grid. */}
          <Link
            href="#hero"
            className="-ml-2.5 inline-flex size-11 shrink-0 items-center justify-center rounded-md transition-colors hover:text-primary"
          >
            <Code className="h-6 w-6" />
            <span className="sr-only">{basics.name}</span>
          </Link>

          <nav aria-label="Main" className="hidden md:flex md:items-center md:gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            {basics.profiles.map((p) => (
              <Button
                key={p.network}
                variant="ghost"
                size="icon"
                className="size-11"
                asChild
              >
                <Link href={p.url} target="_blank" rel="noopener noreferrer">
                  {p.network === "LinkedIn" ? (
                    <Linkedin className="h-5 w-5" />
                  ) : (
                    <Github className="h-5 w-5" />
                  )}
                  <span className="sr-only">{p.network}</span>
                </Link>
              </Button>
            ))}
            <Button variant="ghost" size="icon" className="size-11" asChild>
              <Link href={`mailto:${email}`}>
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-11"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {mounted &&
                (theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                ))}
            </Button>
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="icon"
              className="-mr-2.5 size-11 md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/*
          Kept mounted so it can animate, but `invisible` when closed - that
          removes the links from the tab order and the accessibility tree,
          which `max-h-0` alone would not do.
        */}
        <div
          id="mobile-nav"
          className={`overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl transition-[max-height,opacity,visibility] duration-300 ease-out md:hidden ${
            menuOpen
              ? "max-h-[22rem] opacity-100"
              : "invisible max-h-0 opacity-0"
          }`}
        >
          <nav aria-label="Site" className="container flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center rounded-md px-2 text-base font-medium transition-colors hover:bg-accent hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="flex-1">
        <section
          id="hero"
          className="relative flex min-h-screen items-center justify-center overflow-hidden supports-[min-height:100svh]:min-h-[100svh]"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          {/* Decorative blurred orbs */}
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

          <div className="container relative z-10 py-32 md:py-40">
            <div className="mx-auto max-w-4xl text-center">
              {currentJob &&
                (currentJob.url ? (
                  <Link
                    href={currentJob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mb-6 inline-flex min-h-11 items-center gap-2 rounded-full border bg-background/60 px-5 py-2 text-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-background"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-muted-foreground">Currently at</span>
                    <span className="font-medium">{currentJob.company}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                ) : (
                  <Badge className="mb-6 px-4 py-1.5 text-sm" variant="outline">
                    Currently at {currentJob.company}
                  </Badge>
                ))}
              <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text pb-1 text-transparent">
                  {firstName} {restName[0]}
                </span>
                <span className="block bg-gradient-to-br from-primary to-primary/70 bg-clip-text pb-1 text-transparent">
                  {restName.slice(1).join(" ")}
                </span>
              </h1>
              <div className="mx-auto mb-8 h-1 w-24 rounded-full bg-gradient-to-r from-primary/60 to-primary" />
              <p className="mb-6 text-xl font-medium text-foreground/80 md:text-2xl">
                {basics.label}
                {secondaryLabel ? ` \u00B7 ${secondaryLabel}` : ""}
              </p>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                {basics.headline}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="min-h-11 min-w-[180px] shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link href="#contact">
                    <Contact className="mr-2 h-5 w-5" /> Contact me
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-11 min-w-[180px] backdrop-blur-sm"
                  asChild
                >
                  <Link href="#projects">
                    <User className="mr-2 h-5 w-5" /> See my work
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        <section id="about" aria-labelledby="about-heading" className="container py-16 md:py-24">
          <h2 id="about-heading" className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Me
          </h2>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {basics.summary}
            </p>
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-heading" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <h2 id="projects-heading" className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Major Projects
            </h2>

            {featuredProject && (
              <Card asChild className="mx-auto mb-12 max-w-5xl overflow-hidden border-primary/20 shadow-lg">
                <article>
                <div className="grid gap-0 md:grid-cols-5">
                  <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:col-span-2 md:p-10">
                    <Badge className="mb-4 gap-1.5" variant="outline">
                      <Star className="h-3 w-3" /> Featured
                    </Badge>
                    <h3 className="mb-2 text-3xl font-bold tracking-tight">
                      {featuredProject.name}
                    </h3>
                    <p className="mb-4 text-base font-medium text-primary">
                      {featuredProject.tagline}
                    </p>
                    <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <Period
                        start={featuredProject.startDate}
                        end={featuredProject.endDate}
                      />
                    </div>
                    {featuredProject.url && (
                      <Button asChild className="min-h-11 shadow-md">
                        <Link
                          href={featuredProject.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" /> Visit Brokxr
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="p-8 md:col-span-3 md:p-10">
                    <p className="mb-6 text-muted-foreground leading-relaxed">
                      {featuredProject.summary}
                    </p>
                    <ul className="mb-6 space-y-3">
                      {highlightsFor(
                        featuredProject.highlights as Highlight[],
                        "web",
                      ).map((h, i) => (
                        <li key={i} className="flex gap-3 text-muted-foreground">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="flex flex-wrap gap-2">
                      {featuredProject.technologies.map((t) => (
                        <li key={t}>
                          <Badge variant="secondary">{t}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </article>
              </Card>
            )}

            <ul className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
              {otherProjects.map((project) => (
                <Card
                  asChild
                  key={project.name}
                  className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <li>
                  <CardHeader className="flex-1">
                    <div className="flex min-h-[36px] items-center justify-between gap-2">
                      <CardTitle>{project.name}</CardTitle>
                      {"context" in project && project.context && (
                        <Badge variant="outline" className="shrink-0">
                          {project.context}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{project.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-wrap gap-2">
                      {project.technologies.map((tag) => (
                        <li key={tag}>
                          <Badge variant="secondary">{tag}</Badge>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  </li>
                </Card>
              ))}
            </ul>
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-heading" className="container py-16 md:py-24">
          <h2 id="experience-heading" className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Professional Experience
          </h2>
          <ol className="mx-auto max-w-4xl">
            {work.map((job) => (
              <li
                key={`${job.company}-${job.position}`}
                className="mb-12 border-l-2 border-primary/50 pl-6"
              >
                <article className="relative">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="text-xl font-bold">{job.position}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <Period start={job.startDate} end={job.endDate} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-medium text-primary">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">{job.summary}</p>
                  <ul className="mt-3 space-y-2">
                    {highlightsFor(job.highlights as Highlight[], "web").map(
                      (h, i) => (
                        <li key={i} className="flex gap-3 text-muted-foreground">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                          <span>{h}</span>
                        </li>
                      ),
                    )}
                  </ul>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-normal text-muted-foreground">
                      Technologies:
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {job.technologies.map((tech) => (
                        <li key={tech}>
                          <Badge variant="outline">{tech}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section id="skills" aria-labelledby="skills-heading" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <h2 id="skills-heading" className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Technical Skills
            </h2>
            <div className="mx-auto max-w-4xl space-y-6">
              {skills.map((group) => (
                <div
                  key={group.category}
                  className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <h3 className="w-40 shrink-0 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.category}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <li key={skill}>
                        <Badge variant="outline" className="text-sm">
                          {skill}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-baseline sm:gap-6">
                <h3 className="w-40 shrink-0 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Languages
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <li key={l.language}>
                      <Badge variant="outline" className="text-sm">
                        {l.language} &mdash; {l.fluency}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="education" aria-labelledby="education-heading" className="container py-16 md:py-24">
          <h2 id="education-heading" className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Education
          </h2>
          <div className="mx-auto max-w-3xl">
            {education.map((ed) => (
              <div key={ed.institution} className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-center text-2xl font-bold">
                  {ed.institution}
                </h3>
                <p className="text-lg font-medium text-primary">
                  {ed.studyType} {ed.area}
                </p>
                <p className="text-muted-foreground">{ed.note}</p>
                <p className="text-muted-foreground">{ed.score}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-heading" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="contact-heading" className="mb-8 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get In Touch
              </h2>
              <p className="mb-8 text-muted-foreground">
                Interested in working together? Feel free to reach out through
                any of these channels.
              </p>

              <div className="grid gap-8 md:grid-cols-3">
                {/* Email Card */}
                <Card className="flex flex-col items-center p-6 transition-all hover:shadow-md">
                  <Mail className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-lg font-bold">Email</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{email}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto flex min-h-11 items-center gap-2"
                    onClick={copyEmail}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" /> Copied
                      </>
                    ) : copyFailed ? (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" /> Copy
                        failed
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" /> Copy
                        Email
                      </>
                    )}
                  </Button>
                </Card>

                {basics.profiles.map((p) => (
                  <Card
                    key={p.network}
                    className="flex flex-col items-center p-6 transition-all hover:shadow-md"
                  >
                    {p.network === "LinkedIn" ? (
                      <Linkedin className="mb-4 h-10 w-10 text-primary" />
                    ) : (
                      <Github className="mb-4 h-10 w-10 text-primary" />
                    )}
                    <h3 className="mb-2 text-lg font-bold">{p.network}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {p.network === "LinkedIn"
                        ? "Connect professionally"
                        : "Check out my code"}
                    </p>
                    <Button variant="outline" size="sm" className="mt-auto min-h-11" asChild>
                      <Link
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> Visit Profile
                      </Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} {basics.name}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
