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

export default function Home() {
  // TODO FIX to avoid flicker
  const [theme, setTheme] = useState("light");
  const [copied, setCopied] = useState(false);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
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
    navigator.clipboard.writeText("jesus.herzo@outlook.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          className="relative overflow-hidden bg-muted/30 py-24 md:py-32"
        >
          <div className="absolute inset-0 z-0 opacity-5">
            <div className="absolute inset-0 bg-grid-pattern"></div>
          </div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              {/* <Badge className="mb-4">Available for hire</Badge> */}
              <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Jesus Manuel Hernandez Zozaya
              </h1>
              <p className="mb-8 text-2xl font-medium text-primary">
                Senior Software Engineer
                <Link
                  href="https://x.com/paypal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-secondary"
                >
                  {" "}
                  <span className="mb-8 text-2xl font-medium text-primary">
                    @PayPal
                  </span>
                </Link>
              </p>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
                Full Stack Developer proficient in JavaScript/TypeScript, React
                and NodeJS with thorough knowledge of NextJS, Redux and backend
                technologies.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="#contact"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  <Button size="lg" className="min-w-[160px]">
                    <Contact className="mr-2 h-5 w-5" /> Contact me
                  </Button>
                </Link>

                <Link href="#experience">
                  <Button variant="outline" size="lg" className="min-w-[160px]">
                    <User className="mr-2 h-5 w-5" /> Professional Experience
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        <section id="about" className="container py-16 md:py-24">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-lg text-muted-foreground">
              I define myself as a Senior Full Stack Software Engineer,
              proficient in JavaScript/TypeScript, React and NodeJS; with
              thorough knowledge of NextJS, Redux and backend technologies like
              .Net, and Java. I have worked with Firebase, AWS and Google Cloud.
            </p>
            <p className="text-lg text-muted-foreground">
              {/* eslint-disable-next-line*/}
              `I'm passionate about building scalable, performant web
              applications with clean, maintainable code. My experience spans
              from frontend development to backend services, with a focus on
              creating exceptional user experiences.`
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
                  period: "Apr 2023 - Present",
                  description: [
                    "Worked and architected new solutions for the Digital Wallet team within PayPal, which oversees adding cards, adding banks and transferring funds within PayPal globally.",
                    "Created, with a multidisciplinary team, a new way to add a card on PayPal web, supporting all markets globally and giving the ability to any consumer team to add a card as a plug and play experience, increasing the performance by 2x and revamping the client-side architecture.",
                    "Architected the APIs and client-side views for transferring funds on a new cross functional project called Money Pools, where customers could create pools of money to share with friends, winning new customers and bringing +30M on Total Payments Volume.",
                  ],
                  technologies: [
                    "React",
                    "Typescript",
                    "NextJS",
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
                {
                  role: "Software Developer",
                  company: "Caribbean Sky Tours",
                  period: "Aug 2017 - Jun 2018",
                  description: [
                    "Implemented custom cloud-based tools for the business, based on AWS.",
                    "Developed a continuous Delivery Pipeline with 4 stages: Source, Build, Test and Deploy.",
                  ],
                  technologies: ["AWS", "Laravel", "MySQL"],
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
                    "React Query",
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
                    // "GraphQL",
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
                <Badge className="px-4 py-2 text-base">
                  English C1 BULATS / 571 TOEFL
                </Badge>
                <Badge className="px-4 py-2 text-base">Spanish (Native)</Badge>
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
                title: "Embeddable Add Card",
                description:
                  "Created a new way to add a card on PayPal web, supporting all markets globally and giving the ability to any consumer team within PayPal to add a card as a plug and play experience.",
                tags: ["React", "TypeScript", "NextJS", "Redux"],
              },
              {
                title: "MoneyPools",
                description:
                  "Architected the APIs and client-side views for transferring funds on a new cross functional project called Money Pools, where customers could create pools of money to share with friends.",
                tags: ["React", "TypeScript", "NodeJS", "APIs"],
              },
              {
                title: "COSESY",
                description:
                  "Created a real-time Cow Sensing System that monitored the activity of a cow. Developed the backend using NodeJS and MongoDB; frontend using AngularJS.",
                tags: ["NodeJS", "MongoDB", "AngularJS", "Socket.io", "AWS"],
              },
            ].map((project, index) => (
              <Card
                key={index}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
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
                  <p className="mb-4 text-sm text-muted-foreground">
                    jesus.herzo@outlook.com
                  </p>
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

              <div className="mt-12">
                <p className="text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4 inline-block" />
                  <span>+52 222 522 5414</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <span className="text-sm font-medium">
              Jesus Manuel Hernandez Zozaya
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Jesus Manuel Hernandez Zozaya. All
            rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="mailto:jesus.herzo@outlook.com">
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// eslint-disable-next-line
function Phone(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
