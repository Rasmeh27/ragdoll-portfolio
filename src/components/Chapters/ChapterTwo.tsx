"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChapterHeading from "@/components/ChapterHeading/ChapterHeading";
import ProjectCard from "@/components/ProjectCard/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    image: "/portafolio/lasirena.png",
    category: "Rediseño",
    title: "La sirena",
    href: "https://www.figma.com/proto/pRpExX6EK1jwUatJYFs6GZ/Sirena?node-id=29-1367&t=2yl52mgCH7bYw8wG-1",
  },
  {
    image: "/portafolio/caribbeancinema.png",
    category: "Rediseño",
    title: "Caribbean Cinemas",
    href: "https://www.figma.com/proto/4WeCMLQL5OAwn4zq9Uh3Xt/Sin-título?page-id=0%3A1&node-id=1-3&viewport=29%2C279%2C0.05&t=J8sYU5ybY4K7WkuZ-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A3",
  },
  {
    image: "/portafolio/cuestalibro.png",
    category: "Rediseño",
    title: "Cuesta Libros",
    href: "https://www.figma.com/proto/CX1mg7xrleRnOujtdM3aZl/Sin-título?page-id=0%3A1&node-id=1-3&starting-point-node-id=1%3A3&t=eZTZoYsbb2ig1tCR-1",
  },
  {
    image: "/portafolio/farmaciaCarol.jpg",
    category: "Rediseño",
    title: "Farmacia Carol",
    href: "https://www.figma.com/proto/CFOcXvPJBPD6nZGItf64m6/Sin-título?page-id=0%3A1&node-id=3-2&viewport=330%2C113%2C0.09&t=CGY85ZgCmMI62PMK-1&scaling=min-zoom&content-scaling=fixed",
  },
  {
    image: "/portafolio/arca.jpg",
    category: "Rediseño",
    title: "Arca",
    href: "https://www.figma.com/proto/htHUD98hFSwZeMLFuW1umB/Arca?node-id=9-227&starting-point-node-id=9%3A227&locale=en",
  },
];

const PAGE_SIZE = 3;

/* Divide proyectos en grupos de PAGE_SIZE */
function chunk<T>(arr: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    pages.push(arr.slice(i, i + size));
  }
  return pages;
}

export default function ChapterTwo() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const pages = chunk(projects, PAGE_SIZE);
  const totalPages = pages.length;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const pageEls = pagesRef.current.filter(Boolean) as HTMLDivElement[];
      const mm = gsap.matchMedia();

      /* ── MOBILE: sin pin, fade-in normal ── */
      mm.add("(max-width: 639px)", () => {
        gsap.from(headingRef.current, {
          y: -40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        /* Animar cada card individualmente */
        pageEls.forEach((page) => {
          const cards = page.querySelectorAll("[data-card]");
          cards.forEach((card, i) => {
            gsap.from(card, {
              y: 50,
              opacity: 0,
              scale: 0.95,
              duration: 0.7,
              delay: i * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            });
          });
        });
      });

      /* ── DESKTOP: animación pinned con páginas ── */
      mm.add("(min-width: 640px)", () => {

        const scrollLength = 200 + totalPages * 120; 

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${scrollLength}%`,
            pin: true,
            scrub: 1,
          },
        });

        /* Heading entra */
        tl.from(
          headingRef.current,
          { y: -80, opacity: 0, scale: 1.3, duration: 0.08, ease: "power3.out" },
          0
        );

        /* Cada página: solo la primera visible, las demás ocultas */
        pageEls.forEach((page, i) => {
          if (i > 0) gsap.set(page, { autoAlpha: 0, y: 60 });
        });

        const pageDuration = 0.85 / totalPages; // espacio total para páginas
        const enterDur = pageDuration * 0.28;
        const pauseDur = pageDuration * 0.40;
        const exitDur = pageDuration * 0.32;

        pageEls.forEach((page, pageIndex) => {
          const cards = page.querySelectorAll("[data-card]");
          const pageStart = 0.08 + pageIndex * pageDuration;

          if (pageIndex === 0) {
            /* Primera página: cards entran con stagger */
            cards.forEach((card, i) => {
              tl.from(
                card,
                {
                  scale: 0.4,
                  opacity: 0,
                  y: 150,
                  rotateX: 15,
                  transformOrigin: "center bottom",
                  duration: enterDur,
                  ease: "power3.out",
                },
                pageStart + i * (enterDur / cards.length)
              );
            });
          } else {
            /* Páginas siguientes: todo el grid entra junto */
            tl.to(
              page,
              {
                autoAlpha: 1,
                y: 0,
                duration: enterDur,
                ease: "power3.out",
              },
              pageStart
            );

            cards.forEach((card, i) => {
              gsap.set(card, { opacity: 0, y: 50, scale: 0.9 });
              tl.to(
                card,
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: enterDur * 0.8,
                  ease: "power3.out",
                },
                pageStart + 0.01 + i * (enterDur / (cards.length + 1))
              );
            });
          }

          /* PAUSA — las cards se ven */
          /* (el timeline simplemente no hace nada entre pageStart + enterDur y pageStart + enterDur + pauseDur) */

          /* EXIT */
          const exitStart = pageStart + enterDur + pauseDur;

          if (pageIndex < totalPages - 1) {
            /* Sale haciendo zoom: cards se van */
            cards.forEach((card, i) => {
              tl.to(
                card,
                {
                  scale: 1.8,
                  opacity: 0,
                  y: -80,
                  duration: exitDur,
                  ease: "power2.in",
                },
                exitStart + i * (exitDur / (cards.length + 2))
              );
            });

            /* Ocultar el contenedor de la página */
            tl.to(
              page,
              { autoAlpha: 0, duration: 0.01 },
              exitStart + exitDur - 0.01
            );
          } else {
            /* Última página: cards salen al final */
            cards.forEach((card, i) => {
              tl.to(
                card,
                {
                  scale: 2,
                  opacity: 0,
                  y: -100,
                  duration: exitDur,
                  ease: "power2.in",
                },
                exitStart + i * (exitDur / (cards.length + 2))
              );
            });
          }
        });

        /* Heading sale */
        tl.to(
          headingRef.current,
          { y: -120, opacity: 0, duration: 0.08, ease: "power2.in" },
          0.93
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Capítulo 2 — The Doors"
      className="relative flex flex-col justify-center px-4 py-16 sm:min-h-screen sm:px-6 sm:py-24"
      style={{ perspective: "1000px" }}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <Image src="/fondo-capitulo-2.png" alt="" fill className="object-cover" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div ref={headingRef}>
          <ChapterHeading number="2" title="The Doors" />
        </div>

        {/* Contenedor de páginas — en desktop se apilan con position absolute */}
        <div className="relative mt-8 sm:mt-12">
          {pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              ref={(el) => {
                pagesRef.current[pageIndex] = el;
              }}
              className={`grid gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8 ${
                pageIndex > 0 ? "mt-8 sm:absolute sm:inset-x-0 sm:top-0 sm:mt-0" : ""
              }`}
              style={{ perspective: "800px" }}
            >
              {page.map((project) => (
                <div key={project.title} data-card>
                  <ProjectCard
                    image={project.image}
                    category={project.category}
                    title={project.title}
                    href={project.href}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
