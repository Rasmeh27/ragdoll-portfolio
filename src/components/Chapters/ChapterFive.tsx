"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Shooting stars data ── */
const SHOOTING_STARS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  delay: i * 1.8,
  top: 8 + Math.random() * 30,
  left: 10 + Math.random() * 70,
  angle: -25 - Math.random() * 20,
  length: 80 + Math.random() * 120,
}));

export default function ChapterFive() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      /* ═══════════════════════════════════════════
         Initial states — everything hidden
         ═══════════════════════════════════════════ */
      gsap.set(".ch5-badge", { autoAlpha: 0, y: 30, filter: "blur(8px)" });
      gsap.set(".ch5-title", { autoAlpha: 0, y: 50, scale: 0.85, filter: "blur(16px)" });
      gsap.set(".ch5-subtitle", { autoAlpha: 0, y: 25, filter: "blur(8px)" });
      gsap.set(".ch5-paragraph", { autoAlpha: 0, y: 30, filter: "blur(10px)" });
      gsap.set(".ch5-closing", { autoAlpha: 0, y: 20, filter: "blur(6px)" });
      gsap.set(".ch5-footer", { autoAlpha: 0, y: 15 });
      gsap.set(".ch5-star", { autoAlpha: 0, scale: 0 });
      gsap.set(".shooting-star", { autoAlpha: 0, scaleX: 0 });

      /* ═══════════════════════════════════════════
         Main entrance timeline
         ═══════════════════════════════════════════ */
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      introTl
        // Badge
        .to(".ch5-badge", {
          autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8,
        })
        // Title — epic scale-up
        .to(".ch5-title", {
          autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.4,
          ease: "power4.out",
        }, "-=0.4")
        // Subtitle
        .to(".ch5-subtitle", {
          autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9,
        }, "-=0.6")
        // Paragraphs stagger
        .to(".ch5-paragraph", {
          autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8,
          stagger: 0.2,
        }, "-=0.3")
        // Closing message
        .to(".ch5-closing", {
          autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8,
        }, "-=0.2")
        // Stars pop in one by one
        .to(".ch5-star", {
          autoAlpha: 1, scale: 1, duration: 0.5,
          stagger: { each: 0.08, from: "random" },
          ease: "back.out(3)",
        }, "-=1")
        // Footer
        .to(".ch5-footer", {
          autoAlpha: 1, y: 0, duration: 0.6,
        }, "-=0.2");

      /* ═══════════════════════════════════════════
         Shooting stars — infinite loop
         ═══════════════════════════════════════════ */
      const shootingStars = gsap.utils.toArray<HTMLElement>(".shooting-star");
      shootingStars.forEach((star, i) => {
        const data = SHOOTING_STARS[i];
        gsap.timeline({ repeat: -1, delay: data.delay })
          .set(star, { autoAlpha: 0, scaleX: 0, x: 0, y: 0 })
          .to(star, {
            autoAlpha: 1, scaleX: 1, duration: 0.3, ease: "power2.in",
          })
          .to(star, {
            x: data.length * 2, y: data.length * 0.8,
            autoAlpha: 0, duration: 0.8, ease: "power1.in",
          })
          .set(star, { autoAlpha: 0, scaleX: 0, x: 0, y: 0 })
          // Random pause between appearances
          .to(star, { duration: 3 + Math.random() * 5 });
      });

      /* ═══════════════════════════════════════════
         Parallax — background drifts slowly
         ═══════════════════════════════════════════ */
      gsap.to(".ch5-bg", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      /* ═══════════════════════════════════════════
         Floating glow — breathes gently
         ═══════════════════════════════════════════ */
      gsap.to(".ch5-glow", {
        opacity: 0.4,
        scale: 1.1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* ═══════════════════════════════════════════
         Title shimmer — subtle gold pulse
         ═══════════════════════════════════════════ */
      gsap.to(".ch5-title", {
        textShadow: "0 0 60px rgba(245,197,24,0.4), 0 0 120px rgba(245,197,24,0.15)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* ═══════════════════════════════════════════
         Desktop: subtle parallax layers
         ═══════════════════════════════════════════ */
      mm.add("(min-width: 768px)", () => {
        gsap.to(".ch5-text-block", {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* ── Background image with parallax ── */}
      <div className="ch5-bg absolute inset-0 will-change-transform">
        <Image
          src="/fondo-capitulo-5.jpg"
          alt="Coraline y Wybie mirando las estrellas"
          fill
          className="object-cover object-bottom "
          priority={false}
          sizes="100vw"
        />
      </div>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/60" />
      <div className="ch5-glow absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,197,24,0.06)_0%,transparent_50%)] opacity-20" />

      {/* ── Shooting stars ── */}
      {SHOOTING_STARS.map((s) => (
        <div
          key={s.id}
          className="shooting-star pointer-events-none absolute z-10 h-[1px] w-[60px] origin-left opacity-0"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            transform: `rotate(${s.angle}deg)`,
            background: "linear-gradient(90deg, rgba(245,197,24,0.8), transparent)",
          }}
        />
      ))}

      {/* ── Decorative stars ── */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="ch5-star pointer-events-none absolute z-10 rounded-full bg-white"
          style={{
            width: `${1 + Math.random() * 2.5}px`,
            height: `${1 + Math.random() * 2.5}px`,
            top: `${5 + Math.random() * 40}%`,
            left: `${5 + Math.random() * 90}%`,
            boxShadow: `0 0 ${4 + Math.random() * 8}px rgba(255,255,255,0.6)`,
          }}
        />
      ))}

      {/* ── Content ── */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-between px-6 py-16 md:px-8 md:py-20">

        {/* Text block */}
        <div className="ch5-text-block flex max-w-3xl flex-1 flex-col items-center justify-center text-center will-change-transform">
          <span className="ch5-badge font-mono text-sm tracking-[0.3em] uppercase text-ragdoll-cream/70">
            Capítulo 5
          </span>

          <h2 className="ch5-title font-display mt-3 text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] text-ragdoll-gold drop-shadow-[0_0_30px_rgba(245,197,24,0.2)]">
            The End
          </h2>

          <p className="ch5-subtitle mt-6 font-mono text-base tracking-wide text-ragdoll-cream/80 md:text-lg">
            Gracias por explorar mi portafolio.
          </p>

          <div className="mt-8 space-y-5">
            <p className="ch5-paragraph font-mono text-sm leading-relaxed tracking-wide text-ragdoll-cream/70 md:text-base">
              Cada proyecto es una nueva historia por contar. Cada usuario es un personaje que espera ser comprendido. Cada diseño es un hilo que espera ser tejido para crear algo significativo.
            </p>
            <p className="ch5-closing font-mono text-base tracking-wide text-ragdoll-cream/90 md:text-lg">
              Creemos algo hermoso juntos.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="ch5-footer text-center">
          <p className="font-mono text-xs tracking-wide text-ragdoll-cream/40">
            © 2026 Rosaly Lebron. All rights reserved. Designed with care and threads.{" "}
            <span className="text-ragdoll-cream  underline-offset-2">
              Gracias Luis por hacer esto posible
            </span>
            .
          </p>
        </footer>
      </div>
    </section>
  );
}
