"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, DollarSign, Zap, TrendingUp, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { projects, type Project } from "@/lib/projects";

interface ProjectsShowcaseProps {
  visible: boolean;
  onBack: () => void;
  onLearnMore: (project: Project) => void;
}

export default function ProjectsShowcase({
  visible,
  onBack,
  onLearnMore,
}: ProjectsShowcaseProps) {
  const benefitIcons: Record<number, React.ReactNode> = {
    0: <DollarSign />,
    1: <Zap />,
    2: <TrendingUp />,
    3: <ShieldCheck />,
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="projects-showcase"
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
            {projects.map((project, i) => (
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
                <div className="project-image-wrapper">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="project-image"
                    sizes="(max-width: 640px) 100vw, 560px"
                  />
                  <div className="project-image-overlay" />
                  <div className="project-benefits">
                    {project.benefits.map((benefit, idx) => (
                      <span key={benefit.label} className="project-benefit-tag">
                        {benefitIcons[idx] ?? <Zap />}
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
