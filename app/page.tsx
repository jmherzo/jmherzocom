"use client";
import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Briefcase,
  User,
  Layers,
  Zap,
  GraduationCap,
  Calendar,
  Moon,
  Sun,
  Copy,
  Check,
  Contact,
} from "lucide-react";

const email = "jesus@jmherzo.com";

export default function Home() {
  // TODO FIX to avoid flicker
  const [theme, setTheme] = useState("light");
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Copy email function
  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={`fixed top-0 z-40 w-full transition-all duration-300 ${scrolled ? "border-b border-border/50 bg-background/60 backdrop-blur-xl shadow-sm" : "border-b border-transparent bg-transparent"}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="#hero"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              <span className="sr-only">Jesus Manuel Hernandez Zozaya</span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link
              href="#about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="#experience"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Experience
            </Link>
            <Link
              href="#skills"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Skills
            </Link>
            <Link
              href="#education"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Education
            </Link>
            <Link
              href="#projects"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Projects
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="https://linkedin.com/in/jmherzo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </Link>
            <Link
              href="https://github.com/jmherzo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <Link href={`mailto:${email}`}>
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
              <Badge className="mb-6 px-4 py-1.5 text-sm" variant="outline">
                Available for hire
              </Badge>
              <h1 className="mb-4 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Jesus Manuel
              </h1>
              <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                Hernandez Zozaya
              </h1>
              <div className="mx-auto mb-8 h-1 w-24 rounded-full bg-gradient-to-r from-primary/60 to-primary" />
              <p className="mb-6 text-xl font-medium text-foreground/80 md:text-2xl">
                Senior Software Engineer &middot; Tech Lead
              </p>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                7+ years building high-scale consumer products. Specializing in
                React, TypeScript, GraphQL, and distributed frontend
                architecture. Led cross-functional initiatives serving hundreds
                of millions of users globally.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="#contact">
                  <Button
                    size="lg"
                    className="min-w-[180px] shadow-lg shadow-primary/20"
                  >
                    <Contact className="mr-2 h-5 w-5" /> Contact me
                  </Button>
                </Link>
                <Link href="#experience">
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[180px] backdrop-blur-sm"
                  >
                    <User className="mr-2 h-5 w-5" /> Experience
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        <section id="about" className="container py-16 md:py-24">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg text-muted-foreground">
              I am passionate about building, maintaining, and scaling
              performant web applications with clean code. My work spans the
              entire lifecycle—from architecting client-side interactions to
              service definition and backend design. With a strong foundation in
              frontend development and extensive full-stack experience, I thrive
              at the intersection of technical depth and product impact. I enjoy
              leading teams, mentoring engineers, and collaborating with
              cross-functional stakeholders to deliver high-quality products
              that delight users and drive business success.
            </p>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Frontend Development",
                description:
                  "Building responsive, accessible, and performant user interfaces with React, TypeScript, and modern JavaScript frameworks.",
                icon: "Code",
              },
              {
                title: "Full Stack Expertise",
                description:
                  "Creating end-to-end solutions with React, NodeJS, and various backend technologies to deliver complete applications.",
                icon: "Layers",
              },
              {
                title: "Technical Leadership",
                description:
                  "Guiding engineering decisions, planning architecture, and coordinating with business stakeholders to deliver successful products.",
                icon: "Zap",
              },
            ].map((item, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center gap-4">
                  {item.icon === "Code" && (
                    <Code className="h-8 w-8 text-primary" />
                  )}
                  {item.icon === "Layers" && (
                    <Layers className="h-8 w-8 text-primary" />
                  )}
                  {item.icon === "Zap" && (
                    <Zap className="h-8 w-8 text-primary" />
                  )}
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="experience" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Professional Experience
            </h2>
            <div className="mx-auto max-w-4xl">
              {[
                {
                  role: "Senior Software Engineer (MTS 1)",
                  company: "PayPal",
                  period: "Apr 2023 - Feb 2026",
                  description: [
                    "Senior Full Stack Engineer and lead on the Digital Wallet team, overseeing card management, bank linking, and fund transfers related operations for PayPal's 400M+ global user base.",
                    "Led the Digital Wallet team's integration into PayPal's federated super graph architecture, powering the next-generation iOS and Android app for 400M+ users. Drove adoption of a server-selected components pattern that reduced data-fetching latency by 2x, guiding 20+ engineers and team leads through the implementation.",
                    "Engineered the GraphQL layer and Next.js UI flows for a confidential next-generation in-device wallet initiative targeting a tier 1 software company. Delivered the end-to-end card provisioning experience including security compliance flows with Visa and Mastercard.",
                    "Architected the client-side and API layer for Money Pools, a cross-functional fund-sharing product that drove +$30M in Total Payment Volume.",
                    "Co-led the rebuild of PayPal's global add card experience on web, delivering a plug-and-play architecture used across all markets with 2x performance improvement.",
                  ],
                  technologies: [
                    "React",
                    "Typescript",
                    "NextJS",
                    "GraphQL",
                    "Apollo",
                    "Redux",
                    "NodeJS",
                    "Jenkins",
                    "Github",
                  ],
                },
                {
                  role: "Front End Tech Lead",
                  company: "AutoZone",
                  period: "Mar 2021 - Apr 2023",
                  description: [
                    "Guided the frontend engineering decisions for the Customer team inside autozone.com. Planned new work, architecture of new features, coordination with business, releasing new versions to production and communication with stakeholders.",
                    "Designed and developed with the customer team, the frontend implementation of the key products recommendation feature inside a product details page. This feature increased weekly sales by 20%.",
                  ],
                  technologies: [
                    "React",
                    "Typescript",
                    "NextJS",
                    "Redux",
                    "NodeJS",
                    "Jenkins",
                    "Gitlab",
                    "TanStack-query",
                  ],
                },
                {
                  role: "Systems Engineer",
                  company: "AutoZone",
                  period: "Oct 2021 - Apr 2023",
                  description: [
                    "Enhanced and created complex frontend flows as well as new features for autozone.com. Improving flows like sign in, create account, rewards program, and orders history.",
                    "Refactored a whole suite of react components to use the hook pattern, reducing complexity, moving away from class components, removing boilerplate code, and reducing overall file size.",
                  ],
                  technologies: [
                    "React",
                    "Typescript",
                    "NextJS",
                    "Redux",
                    "NodeJS",
                  ],
                },
                {
                  role: "Systems Engineer Assoc",
                  company: "AutoZone",
                  period: "Aug 2020 - Oct 2021",
                  description: [
                    "Designed and implemented new features for the Customer team inside autozone.com. Worked on the refactor of the profile page, reducing code complexity, making it mobile first and increasing overall load speed.",
                  ],
                  technologies: ["React", "JavaScript", "Redux", "NodeJS"],
                },
                {
                  role: "Software Developer",
                  company: "Ellucian",
                  period: "Jun 2018 - Aug 2020",
                  description: [
                    "Developed custom UI interfaces with different levels of complexity and backend services for web-based applications.",
                    "Helped to improve the frontend development flow related to code transpilation with webpack and linting enhancements for standardization.",
                    "Implemented and contributed to a proprietary React Component Library (based on Material UI) and integrated a complete proprietary Design System (which included a theme palette, images, and wording guides).",
                  ],
                  technologies: [
                    "React",
                    "Typescript",
                    "ASP.Net MVC 5",
                    "SQL Server",
                    "Jenkins",
                  ],
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="mb-12 border-l-2 border-primary/50 pl-6"
                >
                  <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <h3 className="text-xl font-bold">{job.role}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{job.period}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-medium text-primary">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {job.description.map((desc, i) => (
                        <p key={i} className="text-muted-foreground">
                          {desc}
                        </p>
                      ))}
                    </div>
                    <div className="mt-3">
                      <span className="text-muted-foreground">
                        Technologies:
                      </span>
                      {job.technologies.map((tech, i) => (
                        <Badge key={i} variant="outline" className="ml-2">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="container py-16 md:py-24">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Education
          </h2>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <GraduationCap className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                Instituto Tecnologico y de Estudios Superiores de Monterrey
                (ITESM)
              </h3>
              <p className="text-lg font-medium text-primary">
                B.S. Robotics and Digital Systems Engineering
              </p>
              <p className="text-muted-foreground">
                Graduated with honorable mention of excellence in 2017
              </p>
              <p className="text-muted-foreground">GPA: 95/100</p>
            </div>
          </div>
        </section>

        <section id="skills" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Technical Skills
            </h2>
            <Tabs defaultValue="frontend" className="mx-auto max-w-4xl">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="tools">Tools & Methods</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
              </TabsList>
              <TabsContent value="frontend" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {[
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Redux",
                    "NextJS",
                    "HTML5",
                    "CSS/SCSS",
                    "Tailwind CSS",
                    "Material UI",
                    "Shadcn",
                    "TanStack Query",
                    "Styled Components",
                  ].map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="justify-center py-3 text-base"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="backend" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {[
                    "NodeJS",
                    "Express",
                    "ASP.Net MVC",
                    "Java",
                    "REST APIs",
                    "GraphQL",
                    "Apollo",
                    "MongoDB",
                    "SQL Server",
                    "MySQL",
                    "Firebase",
                    "AWS",
                    "Laravel",
                  ].map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="justify-center py-3 text-base"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="tools" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {[
                    "Git",
                    "GitHub",
                    "GitLab",
                    "Jenkins",
                    "CI/CD",
                    "Webpack",
                    "Agile/Scrum",
                    "Vercel",
                    "Performance Optimization",
                    "Accessibility",
                    "Responsive Design",
                  ].map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="justify-center py-3 text-base"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="learning" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {["Swift", "GCP", "React Native", "Python"].map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="justify-center py-3 text-base"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-12 text-center">
              <h3 className="mb-4 text-xl font-bold">Languages</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="px-4 py-2 text-base" variant="outline">
                  English C1 BULATS / 571 TOEFL
                </Badge>
                <Badge className="px-4 py-2 text-base" variant="outline">
                  Spanish (Native)
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="container py-16 md:py-24">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Major Projects
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Brokxr",
                description:
                  "My own company project — founded, architected and built from the ground up a Full Stack insurtech platform to manage the complete policy lifecycle for insurance brokers. Designed a data access layer and DTO architecture to handle policy management, client tracking, prospect pipelines, renewal workflows, premium receipt generation, and multi-channel client communication.",
                tags: [
                  "Next.js",
                  "Firebase",
                  "Shadcn",
                  "TanStack Query",
                  "Vercel",
                ],
                link: "https://brokxr.com",
              },
              {
                title: "Wallet into Federated Super Graph",
                description:
                  "Led the Digital Wallet team's integration into PayPal's federated super graph architecture, powering the next-generation mobile app for 400M+ users. Drove adoption of a server-selected components pattern that reduced data-fetching latency by 2x.",
                tags: ["GraphQL", "Apollo", "React", "TypeScript"],
              },
              {
                title: "PayPal Global Add Card",
                description:
                  "Co-led the rebuild of PayPal's global add card experience on web, delivering a plug-and-play architecture used across all markets with 2x performance improvement.",
                tags: ["React", "TypeScript", "NextJS", "Redux"],
              },
            ].map((project, index) => (
              <Card
                key={index}
                className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="flex-1">
                  <div className="flex min-h-[36px] items-center justify-between gap-2">
                    <CardTitle>{project.title}</CardTitle>
                    {"link" in project && project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-1 h-3 w-3" /> Visit
                        </Button>
                      </Link>
                    )}
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contact" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-8 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Get In Touch
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
                    className="mt-auto flex items-center gap-2"
                    onClick={copyEmail}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy Email
                      </>
                    )}
                  </Button>
                </Card>

                {/* LinkedIn Card */}
                <Card className="flex flex-col items-center p-6 transition-all hover:shadow-md">
                  <Linkedin className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-lg font-bold">LinkedIn</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Connect professionally
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto"
                    asChild
                  >
                    <Link
                      href="https://linkedin.com/in/jmherzo/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Visit Profile
                    </Link>
                  </Button>
                </Card>

                {/* GitHub Card */}
                <Card className="flex flex-col items-center p-6 transition-all hover:shadow-md">
                  <Github className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-lg font-bold">GitHub</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Check out my code
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto"
                    asChild
                  >
                    <Link
                      href="https://github.com/jmherzo"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Visit Profile
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Jesus Manuel Hernandez Zozaya. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
