"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  DollarSign,
  Zap,
  TrendingUp,
  ShieldCheck,
  Database,
  Clock,
  Brain,
  Target,
  Mail,
  RefreshCw,
  Bell,
  CheckCircle2,
  Globe,
  Users,
  BarChart3,
  Lock,
  Layers,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import { projects, type Project, type BenefitIcon } from "@/lib/projects";
import { useRef, useCallback, useEffect, type ReactNode } from "react";

interface ProjectsShowcaseProps {
  visible: boolean;
  onBack: () => void;
  onLearnMore: (project: Project) => void;
  filter: string;
}

export default function ProjectsShowcase({
  visible,
  onBack,
  onLearnMore,
  filter,
}: ProjectsShowcaseProps) {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleScroll = useCallback(() => {
    const el = showcaseRef.current;
    if (!el) return;
    el.classList.add("is-scrolling");
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      el.classList.remove("is-scrolling");
    }, 800);
  }, []);

  useEffect(() => {
    return () => clearTimeout(scrollTimer.current);
  }, []);

  const filteredProjects = projects.filter((p) => {
    const q = filter.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const iconMap: Record<BenefitIcon, ReactNode> = {
    dollar: <DollarSign />,
    zap: <Zap />,
    trending: <TrendingUp />,
    shield: <ShieldCheck />,
    database: <Database />,
    clock: <Clock />,
    brain: <Brain />,
    target: <Target />,
    mail: <Mail />,
    refresh: <RefreshCw />,
    bell: <Bell />,
    check: <CheckCircle2 />,
    globe: <Globe />,
    users: <Users />,
    "bar-chart": <BarChart3 />,
    lock: <Lock />,
    layers: <Layers />,
    rocket: <Rocket />,
  };

  const getBenefitIcon = (label: string, icon?: BenefitIcon): ReactNode => {
    if (icon && iconMap[icon]) return iconMap[icon];
    const l = label.toLowerCase();
    if (l.includes("$") || l.includes("savings") || l.includes("cost")) return <DollarSign />;
    if (l.includes("renewal")) return <RefreshCw />;
    if (l.includes("email") || l.includes("parsing")) return <Mail />;
    if (l.includes("notification") || l.includes("missed")) return <Bell />;
    if (l.includes("bulk") || l.includes("metadata")) return <Database />;
    if (l.includes("api limit") || l.includes("api safe")) return <ShieldCheck />;
    if (l.includes("manual")) return <ShieldCheck />;
    if (l.includes("24/7")) return <Clock />;
    if (l.includes("context") || l.includes("aware")) return <Brain />;
    if (l.includes("accuracy") || l.includes("data-driven")) return <Target />;
    if (l.includes("wait time")) return <Zap />;
    if (l.includes("scaling") || l.includes("instant")) return <TrendingUp />;
    if (l.includes("automated") || l.includes("automation")) return <Zap />;
    if (l.includes("zero")) return <ShieldCheck />;
    if (l.includes("sync") || l.includes("global")) return <Globe />;
    if (l.includes("team") || l.includes("user")) return <Users />;
    if (l.includes("analytics") || l.includes("report")) return <BarChart3 />;
    if (l.includes("secur") || l.includes("compliance")) return <Lock />;
    if (l.includes("scalab") || l.includes("multi")) return <Layers />;
    if (l.includes("fast") || l.includes("launch")) return <Rocket />;
    return <Zap />;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={showcaseRef}
          className="projects-showcase"
          onScroll={handleScroll}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2
            className="projects-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Projects
          </motion.h2>

          <div className="projects-grid">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.25 + i * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ y: -4 }}
              >
                <div className={`project-image-wrapper${project.imageTheme === "light" ? " light-image" : ""}`}>
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    className="project-image"
                    sizes="(max-width: 640px) 100vw, 560px"
                  />
                  <div className="project-image-overlay" />
                  <div className="project-benefits">
                    {project.benefits.map((benefit, idx) => (
                      <span key={benefit.label} className="project-benefit-tag">
                        {getBenefitIcon(benefit.label, benefit.icon)}
                        {benefit.label}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    className="project-learn-more"
                    onClick={() => onLearnMore(project)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn more <ArrowRight size={14} />
                  </motion.button>
                </div>

                <div className="project-info">
                  <h3 className="project-name">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
