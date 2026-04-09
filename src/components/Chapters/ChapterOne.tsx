"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChapterHeading from "@/components/ChapterHeading/ChapterHeading";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: "/icons/heart.svg",
    title: "Empatía primero",
    description: "Escucho para comprender, no para responder.",
  },
  {
    icon: "/icons/brain.svg",
    title: "Lógicos",
    description: "Cada píxel tiene un propósito.",
  },
  {
    icon: "/icons/user.svg",
    title: "Centrados en el usuario",
    description: "Diseño para personas, no para pantallas.",
  },
  {
    icon: "/icons/star.svg",
    title: "Detallistas",
    description: "La magia vive en las pequeñas cosas.",
  },
];

const FRAME_COUNT = 11;
const frames = Array.from({ length: FRAME_COUNT }, (_, i) => `/Tunel/frame${i + 1}.png`);

export default function ChapterOne() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLDivElement | null)[]>([]);
  const peekRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from("[data-about-content]", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-about-content]",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from("[data-value-card]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-values-grid]",
          start: "top 85%",
        },
      });

      const frameEls = framesRef.current.filter(Boolean) as HTMLDivElement[];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: tunnelRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 1,
        },
      });

      // Contenido zoom out
      tl.to(
        contentRef.current,
        {
          scale: 2.5,
          opacity: 0,
          duration: 0.15,
          ease: "power2.in",
        },
        0
      );

      // Transición de frames
      for (let i = 0; i < frameEls.length - 1; i++) {
        const segmentDuration = 0.75 / (frameEls.length - 1);
        const segmentStart = i * segmentDuration;

        tl.to(
          frameEls[i],
          {
            opacity: 0,
            duration: segmentDuration,
            ease: "none",
          },
          segmentStart
        );

        tl.to(
          frameEls[i + 1],
          {
            opacity: 1,
            duration: segmentDuration,
            ease: "none",
          },
          segmentStart
        );
      }

      // El texto "Capítulo 2 / The Doors" aparece sobre la puerta
      tl.fromTo(
        peekRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.10,
          ease: "power2.out",
        },
        0.65
      );

      // Pausa — el texto se queda visible un rato sobre la puerta
      // (entre 0.75 y 0.88 no pasa nada con el texto, solo se ve)

      // El texto sube y desaparece, como si se va hacia arriba
      tl.to(
        peekRef.current,
        {
          y: -150,
          opacity: 0,
          scale: 1.1,
          duration: 0.12,
          ease: "power2.in",
        },
        0.88
      );

      // El último frame se desvanece a negro
      tl.to(
        frameEls[frameEls.length - 1],
        {
          opacity: 0,
          duration: 0.12,
          ease: "power1.inOut",
        },
        0.88
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} aria-label="Capítulo 1 — The Ragdoll Awakens">
      <div ref={tunnelRef} className="relative h-screen w-full overflow-hidden bg-ragdoll-dark">

        {/* CAPA 1: Frames del túnel + puerta */}
        <div className="absolute inset-0 z-10" aria-hidden="true">
          {frames.map((src, i) => (
            <div
              key={src}
              ref={(el) => { framesRef.current[i] = el; }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                priority={i < 2}
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* CAPA 2: Texto peek "Capítulo 2 / The Doors" sobre la puerta */}
        <div
          ref={peekRef}
          className="absolute inset-0 z-20 flex items-center justify-center opacity-0"
        >
          <div className="text-center">
            <span className="font-mono text-sm tracking-[0.3em] uppercase text-ragdoll-cream/70">
              Capítulo 2
            </span>
            <p className="font-display mt-2 text-[clamp(2.5rem,6vw,5rem)] leading-tight text-ragdoll-gold">
              The Doors
            </p>
          </div>
        </div>

        {/* CAPA 3: Contenido del capítulo */}
        <div
          ref={contentRef}
          className="relative z-30 flex h-full flex-col justify-start overflow-hidden px-4 pt-10 pb-4 sm:justify-center sm:px-6 sm:py-8 md:py-12"
          style={{ transformOrigin: "center center" }}
        >
          <div className="mx-auto w-full max-w-6xl">
            <ChapterHeading number="1" title="The Ragdoll Awakens" />

            <div
              data-about-content
              className="mt-4 grid items-center gap-6 sm:mt-6 md:grid-cols-2 md:gap-8"
            >
              {/* Logo card — oculto en mobile (ya se ve en Hero), visible en md+ */}
              <div className="hidden justify-center md:flex">
                <div className="relative w-full rounded-2xl border border-ragdoll-gold-dim/30 bg-ragdoll-dark-800/50 p-6">
                  <div className="mb-3 flex justify-center gap-3 text-lg text-ragdoll-gold">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <Image
                    src="/logo.svg"
                    alt="Ragdoll — Mascota del estudio"
                    width={350}
                    height={350}
                    className="mx-auto h-auto w-full max-w-[300px]"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-6">
                <p className="text-xl leading-snug text-ragdoll-cream sm:text-2xl sm:leading-relaxed md:text-3xl">
                  Hola, somos{" "}
                  <span className="font-display text-ragdoll-gold">Ragdoll,</span>
                </p>
                <p className="font-mono text-[13px] leading-relaxed text-ragdoll-cream/80 sm:text-base">
                  Diseñamos desde hace más de{" "}
                  <span className="text-ragdoll-gold">18 años</span> con una sola
                  certeza: cada línea ya es una decisión.
                </p>
                <p className="font-mono text-[13px] leading-relaxed text-ragdoll-cream/80 sm:text-base">
                  Con más de{" "}
                  <span className="text-ragdoll-gold">8 años</span> en{" "}
                  <span className="text-ragdoll-gold">diseño gráfico</span> y más de{" "}
                  <span className="text-ragdoll-gold">2</span> en{" "}
                  <span className="text-ragdoll-gold">UI/UX y diseño de producto</span>,
                  entendimos que lo visible es solo la superficie — lo esencial es la
                  estructura que lo sostiene.
                </p>
                <p className="font-mono text-[13px] leading-relaxed text-ragdoll-cream/80 sm:text-base">
                  Investigamos, probamos e iteramos hasta que cada pieza encuentra su
                  lugar.
                </p>
              </div>
            </div>

            <div
              data-values-grid
              className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4 lg:gap-5"
            >
              {values.map((value) => (
                <div
                  key={value.title}
                  data-value-card
                  className="group rounded-xl border border-ragdoll-gold-dim/20 bg-ragdoll-dark-800/60 px-3 py-3 text-center transition-colors hover:border-ragdoll-gold-dim/40 sm:rounded-2xl sm:p-6"
                >
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-ragdoll-dark-700 sm:mb-4 sm:h-14 sm:w-14 sm:rounded-xl">
                    <Image
                      src={value.icon}
                      alt=""
                      width={28}
                      height={28}
                      className="h-4 w-4 sm:h-7 sm:w-7"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-display text-base text-ragdoll-gold sm:text-xl">
                    {value.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-[10px] leading-snug text-ragdoll-cream/60 sm:mt-2 sm:text-sm sm:leading-normal">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
