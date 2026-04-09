"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Service = {
  icon: string;
  service: string;
  description: string;
  bullets: string[];
  badge?: string;
  iconVariant?: "dark" | "light";
};

const services: Service[] = [
  {
    icon: "/icons/search-check.svg",
    service: "Auditoría UX",
    description:
      "Revisión profunda de producto o app existente. Analizamos flujos críticos, usabilidad y jerarquía visual con ojo de aguja.",
    bullets: ["Evaluación Heurística", "Descubrimiento de Puntos de Fricción"],
    iconVariant: "dark",
  },
  {
    icon: "/icons/layout.svg",
    service: "Rediseño de sistemas",
    description:
      "Transformación total de la experiencia digital. Desde investigación y wireframes hasta diseño de alta fidelidad y prototipos interactivos.",
    bullets: ["Investigación y Estrategia UX", "Prototipado Interactivo"],
    badge: "POPULAR",
    iconVariant: "light",
  },
  {
    icon: "/icons/timer.svg",
    service: "Sprint de Diseño",
    description:
      "Soluciones rápidas en 2 semanas. Definición del problema, exploración intensiva y entrega de un prototipo testeable con usuarios reales.",
    bullets: ["Enmarcado del Problema", "Solución de MVP"],
    iconVariant: "dark",
  },
  {
    icon: "/icons/newspaper.svg",
    service: "Diseño de Sitio Web",
    description:
      "Sitios web que cautivan. Diseño de landing pages o portales de 3–8 pantallas, integrando wireframes y diseño visual de alto impacto.",
    bullets: ["Estructura y Optimización SEO", "Narrativa Visual"],
    iconVariant: "dark",
  },
  {
    icon: "/icons/dashboard.svg",
    service: "Design System Básico",
    description:
      "Librería de componentes escalables en Figma. Definimos tipografía, colores, botones y formularios para una consistencia total.",
    bullets: ["Arquitectura de Componentes", "Documentación"],
    iconVariant: "light",
  },
  {
    icon: "/icons/cube.svg",
    service: "Proyecto Estratégico",
    description:
      "Proyectos ancla de alta visibilidad para empresas que buscan transformar su mercado. Consultoría integral y ejecución premium.",
    bullets: ["Entrega de Alto Impacto", "Alineación de Negocio"],
    iconVariant: "dark",
  },
];

const retainer = {
  icon: "/icons/calendar.svg",
  title: "Retainer Mensual de Diseño",
  description:
    "Soporte continuo de diseño a tu disposición. Hasta 40 horas mensuales de trabajo dedicado para iterar, mejorar y mantener tus productos digitales siempre afinados.",
  cta: "Consultar Disponibilidad",
};

export default function ChapterThree() {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const coralineEase = "steps(12)";
      const smoothEase = "power2.inOut";

      // Section entrance
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      mainTl
        .fromTo(
          ".chapter-eyebrow",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
        )
        .fromTo(
          ".chapter-title",
          { y: 30, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" },
          "-=0.15"
        );

      // Cards entrance
      const cards = gsap.utils.toArray<HTMLElement>(".service-card");

      cards.forEach((card, index) => {
        const xOffset = index % 2 === 0 ? -30 : 30;

        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        })
          .fromTo(
            card,
            {
              opacity: 0,
              y: 40,
              x: xOffset,
              scale: 0.92,
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
              delay: index * 0.03,
            }
          );

        // Icon pop
        const icon = card.querySelector(".card-icon");
        if (icon) {
          gsap.fromTo(
            icon,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              ease: "back.out(1.5)",
              delay: 0.15 + index * 0.03,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Bullets
        const bullets = card.querySelectorAll(".bullet-item");
        if (bullets.length) {
          gsap.fromTo(
            bullets,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.25,
              stagger: 0.06,
              delay: 0.2 + index * 0.03,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Retainer card entrance
      gsap.timeline({
        scrollTrigger: {
          trigger: ".retainer-card",
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })
        .fromTo(
          ".retainer-card",
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
        )
        .fromTo(
          ".retainer-icon",
          { scale: 0 },
          { scale: 1, duration: 0.3, ease: "back.out(1.5)" },
          "-=0.2"
        )
        .fromTo(
          ".retainer-content",
          { opacity: 0, x: -15 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
          "-=0.15"
        )
        .fromTo(
          ".retainer-cta",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
          "-=0.1"
        );

      // Subtle parallax on the background
      gsap.to(".parallax-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-black text-white"
    >
      <div className="parallax-bg absolute inset-0">
        <Image
          src="/fondo-capitulo-3.png"
          alt="Fondo capítulo 3"
          fill
          className="object-cover object-center opacity-80"
          priority={false}
        />
      </div>
      <div className="background-glow absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,185,28,0.10),transparent_45%)] opacity-10" />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <header className="mb-10 text-center sm:mb-14">
          <p className="chapter-eyebrow font-mono text-sm tracking-[0.3em] uppercase text-ragdoll-cream/70">
            Capítulo 3
          </p>

          <h2 className="chapter-title font-display mt-2 text-[clamp(2.5rem,6vw,5rem)] leading-tight text-ragdoll-gold">
            The Map of the Other World
          </h2>
        </header>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((item) => (
            <article
              key={item.service}
              className="service-card group relative overflow-hidden rounded-[20px] border border-[#8a6708]/65 border-dashed bg-black/55 p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-[#f0c21c]/50 sm:rounded-[28px] sm:p-6"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,210,48,0.06),transparent_28%)] opacity-70" />
              <div className="pointer-events-none absolute inset-[1px] rounded-[19px] border border-[#d8a514]/15 sm:rounded-[27px]" />

              {item.badge && (
                <span className="absolute right-4 top-4 rounded-md bg-[#f46a1f] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white sm:right-5 sm:top-5 sm:px-3 sm:py-1">
                  {item.badge}
                </span>
              )}

              <div className="relative z-10">
                <div
                  className={`card-icon mb-4 flex h-10 w-10 items-center justify-center rounded-full sm:mb-5 sm:h-12 sm:w-12 ${
                    item.iconVariant === "light"
                      ? "bg-[#f0c21c]"
                      : "bg-[#f0c21c]/12"
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={`${item.service} icon`}
                    width={20}
                    height={20}
                    className={`h-4 w-4 object-contain sm:h-5 sm:w-5 ${
                      item.iconVariant === "light"
                        ? "opacity-100"
                        : "opacity-90"
                    }`}
                  />
                </div>

                <h3 className="mb-2 text-[1.35rem] font-semibold leading-tight text-white sm:mb-3 sm:text-[1.85rem]">
                  {item.service}
                </h3>

                <p className="mb-4 text-[13px] font-light leading-[1.45] text-ragdoll-gold sm:mb-6 sm:text-[14.5px] sm:leading-[20.35px]">
                  {item.description}
                </p>

                <ul className="space-y-1.5 text-xs text-ragdoll-cream/80 sm:space-y-2 sm:text-sm">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="bullet-item flex items-start gap-2">
                      <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#f46a1f] sm:mt-[7px]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <section className="retainer-card relative mt-5 overflow-hidden rounded-[20px] border border-[#8a6708]/70 border-dashed bg-black/55 p-[1px] sm:mt-6 sm:rounded-[30px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.23]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,210,48,0.05),transparent_30%,transparent_70%,rgba(255,210,48,0.05))]" />
          <div className="pointer-events-none absolute inset-[1px] rounded-[19px] border border-[#d8a514]/20 sm:rounded-[29px]" />
          <div className="absolute inset-0 bg-black/62" />

          <div className="relative z-10 flex flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-7 lg:px-10">
            <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
              <div className="retainer-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f0c21c] shadow-[0_0_30px_rgba(240,194,28,0.14)] sm:h-[72px] sm:w-[72px]">
                <Image
                  src={retainer.icon}
                  alt="Retainer icon"
                  width={36}
                  height={36}
                  className="h-7 w-7 object-contain sm:h-9 sm:w-9"
                />
              </div>

              <div className="retainer-content max-w-3xl">
                <h3 className="text-[1.25rem] font-semibold leading-tight text-white sm:text-[1.6rem] md:text-[2rem]">
                  {retainer.title}
                </h3>

                <p className="mt-1 text-[13px] font-light leading-[1.45] text-ragdoll-gold sm:text-[14.5px] sm:leading-[20.35px]">
                  {retainer.description}
                </p>
              </div>
            </div>

            <div className="retainer-cta md:shrink-0">
              <a
                href="https://wa.me/18494952308?text=Hola%2C%20me%20interesa%20el%20Retainer%20Mensual%20de%20Dise%C3%B1o"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full min-h-[48px] items-center justify-center rounded-[12px] bg-[#f26316] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(242,99,22,0.28)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#ff7126] sm:min-h-[56px] sm:w-auto sm:min-w-[250px] sm:rounded-[14px] sm:px-8 sm:text-base"
              >
                {retainer.cta}
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
