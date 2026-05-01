"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const floatingElements = [
  {
    src: "/green-triangle.svg",
    alt: "Triángulo decorativo verde",
    width: 71,
    height: 67,
    className: "left-[8%] top-[15%] hidden sm:block",
  },
  {
    src: "/puppet-octopus.svg",
    alt: "Pulpo de marioneta decorativo",
    width: 143,
    height: 115,
    className: "right-[8%] top-[12%] hidden sm:block",
  },
  {
    src: "/star-ball.svg",
    alt: "Bola con estrella decorativa",
    width: 71,
    height: 69,
    className: "right-[5%] top-[55%] hidden sm:block",
  },
  {
    src: "/mouse.svg",
    alt: "Ratón decorativo",
    width: 94,
    height: 103,
    className: "left-[20%] bottom-[5%] hidden sm:block",
  },
  {
    src: "/icons/star.svg",
    alt: "",
    width: 40,
    height: 41,
    className: "left-[3%] top-[40%]",
  },
  {
    src: "/icons/star.svg",
    alt: "",
    width: 28,
    height: 29,
    className: "left-[15%] top-[70%] hidden sm:block",
  },
  {
    src: "/icons/star.svg",
    alt: "",
    width: 32,
    height: 33,
    className: "left-[45%] top-[8%] hidden sm:block",
  },
  {
    src: "/icons/star.svg",
    alt: "",
    width: 24,
    height: 25,
    className: "right-[20%] top-[35%] hidden sm:block",
  },
  {
    src: "/icons/star.svg",
    alt: "",
    width: 36,
    height: 37,
    className: "right-[12%] bottom-[15%] hidden sm:block",
  },
  {
    src: "/icons/star.svg",
    alt: "",
    width: 22,
    height: 23,
    className: "right-[3%] top-[28%]",
  },
  {
    src: "/icons/star.svg",
    alt: "",
    width: 30,
    height: 31,
    className: "left-[35%] bottom-[12%] hidden sm:block",
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-logo]", {
        y: -40,
        opacity: 0,
        duration: 1,
      })
        .from(
          "[data-hero-title]",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.4" 
        )
        .from(
          "[data-hero-quote]",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.3"
        )
        .from(
          "[data-hero-author]",
          {
            y: 15,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.2"
        );

      gsap.utils.toArray<HTMLElement>("[data-floating]").forEach((el) => {
        const yDistance = 10 + Math.random() * 15;
        const duration = 3 + Math.random() * 2;
        const delay = Math.random() * 2;

        gsap.to(el, {
          y: `+=${yDistance}`,
          duration,
          delay,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });


        gsap.to(el, {
          rotation: -5 + Math.random() * 10,
          duration: duration * 1.3,
          delay,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      /* ═══════════════════════════════════════════
         Scroll exit — clean parallax layers
         ═══════════════════════════════════════════ */
      const scrubDefaults = {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };

      // Content rises together, fades cleanly
      gsap.to("[data-hero-content]", {
        yPercent: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: scrubDefaults,
      });

      // Floating elements drift upward at their own pace
      gsap.utils.toArray<HTMLElement>("[data-floating]").forEach((el, i) => {
        gsap.to(el, {
          yPercent: -(80 + i * 40),
          opacity: 0,
          ease: "none",
          scrollTrigger: scrubDefaults,
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      aria-label="Hero — Bienvenida a Ragdoll"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <div data-hero-bg className="absolute inset-0 z-0 will-change-transform">
        <Image
          src="/fondo.png"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
      </div>

      {floatingElements.map((item) => (
        <div
          key={item.src}
          data-floating
          className={`absolute z-10 ${item.className}`}
        >
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
          />
        </div>
      ))}

      
      <div data-hero-content className="relative z-20 flex flex-col items-center text-center px-4">
        <div data-hero-logo className="mb-1 w-[200px] sm:w-[260px] md:w-[320px]">
          <Image
            src="/logo.svg"
            alt="Ragdoll — Mascota del estudio, muñeca con botones por ojos"
            width={320}
            height={320}
            className="h-auto w-full"
            priority
          />
        </div>

        <h1
          data-hero-title
          className="font-display text-[clamp(3rem,10vw,10rem)] leading-none font-bold tracking-wide text-white"
        >
          Ragdoll
        </h1>

        <blockquote data-hero-quote className="mt-6 max-w-2xl sm:mt-8">
          <p className="font-display text-[clamp(1.1rem,2.5vw,2rem)] leading-relaxed text-ragdoll-gold">
            &ldquo;El fracaso de un producto rara vez es técnico.
            <br />
            Casi siempre es humano.&rdquo;
          </p>
        </blockquote>

        <p
          data-hero-author
          className="mt-4 font-mono text-xs tracking-widest text-ragdoll-cream/70 sm:mt-6 sm:text-sm"
        >
          &mdash;Rosaly Lebrón&mdash;
        </p>
      </div>
    </section>
  );
}
