"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

/* ── Lazy-load SweetAlert (no se descarga hasta que se envía el form) ── */
const fireAlert = async (type: "success" | "error") => {
  const { default: Swal } = await import("sweetalert2");

  const config = {
    success: {
      icon: "success" as const,
      title: "Mensaje enviado",
      html: '<p style="color:rgba(245,240,232,0.7);font-size:0.95rem;">Tu carta ha sido entregada.<br/>Te responderé pronto.</p>',
      confirmButtonText: "Cerrar",
    },
    error: {
      icon: "error" as const,
      title: "Algo salió mal",
      html: '<p style="color:rgba(245,240,232,0.7);font-size:0.95rem;">No se pudo enviar tu mensaje.<br/>Intenta de nuevo en un momento.</p>',
      confirmButtonText: "Entendido",
    },
  };

  return Swal.fire({
    ...config[type],
    background: "#0a0a0a",
    color: "#f5f0e8",
    confirmButtonColor: "#ea580c",
    customClass: {
      popup: "swal-ragdoll-popup",
      title: "swal-ragdoll-title",
      htmlContainer: "swal-ragdoll-html",
      confirmButton: "swal-ragdoll-btn",
    },
    showClass: { popup: "swal-ragdoll-show" },
    hideClass: { popup: "swal-ragdoll-hide" },
  });
};

export default function ChapterFour() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const formWrapperRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [sending, setSending] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formRef.current || sending) return;

      setSending(true);

      try {
        await emailjs.sendForm(
          SERVICE_ID,
          TEMPLATE_ID,
          formRef.current,
          PUBLIC_KEY
        );
        formRef.current.reset();
        await fireAlert("success");
      } catch {
        await fireAlert("error");
      } finally {
        setSending(false);
      }
    },
    [sending]
  );

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      /* ── Si el usuario prefiere menos movimiento, solo fade ── */
      if (prefersReduced) {
        gsap.set(
          [
            ".chapter4-badge",
            ".chapter4-title",
            ".chapter4-subtitle",
            formWrapperRef.current,
            ".chapter4-field",
            buttonRef.current,
          ],
          { autoAlpha: 0 }
        );

        gsap.to(
          [
            ".chapter4-badge",
            ".chapter4-title",
            ".chapter4-subtitle",
            formWrapperRef.current,
            ".chapter4-field",
            buttonRef.current,
          ],
          {
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.05,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          }
        );
        return;
      }

      /* ── Estados iniciales — SIN filter:blur, solo opacity+transform (GPU) ── */
      gsap.set(".chapter4-badge", { autoAlpha: 0, y: 22 });
      gsap.set(".chapter4-title", { autoAlpha: 0, y: 36, scale: 0.96 });
      gsap.set(".chapter4-subtitle", { autoAlpha: 0, y: 22 });
      gsap.set(formWrapperRef.current, {
        autoAlpha: 0,
        y: 70,
        scale: 0.97,
      });
      gsap.set(".chapter4-field", { autoAlpha: 0, y: 28 });
      gsap.set(buttonRef.current, { autoAlpha: 0, y: 18, scale: 0.92 });

      /* ── Timeline de entrada ── */
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out", force3D: true },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      introTl
        .to(".chapter4-badge", { autoAlpha: 1, y: 0, duration: 0.6 })
        .to(
          ".chapter4-title",
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.85 },
          "-=0.3"
        )
        .to(
          ".chapter4-subtitle",
          { autoAlpha: 1, y: 0, duration: 0.65 },
          "-=0.45"
        )
        .to(
          formWrapperRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .to(
          ".chapter4-field",
          { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.1 },
          "-=0.5"
        )
        .to(
          buttonRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );

      /* ── Fondo: parallax con scrub (solo cuando está en viewport) ── */
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.08, yPercent: -2 },
          {
            scale: 1,
            yPercent: 2,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          }
        );

        /* Flotación suave — PAUSADA cuando sale del viewport */
        const floatTween = gsap.to(bgRef.current, {
          y: "+=10",
          x: "+=4",
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
          paused: true,
        });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => floatTween.play(),
          onLeave: () => floatTween.pause(),
          onEnterBack: () => floatTween.play(),
          onLeaveBack: () => floatTween.pause(),
        });
      }

      /* ── Parallax header y form (solo desktop) ── */
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          headerRef.current,
          { y: 0 },
          {
            y: -14,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          formWrapperRef.current,
          { y: 0 },
          {
            y: 18,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      /* ── Focus/blur en campos — CSS transitions en vez de GSAP ── */
      /* (movido a CSS class .chapter4-control:focus para 0 JS en cada frame) */

      /* ── Hover del botón ── */
      if (buttonRef.current) {
        const button = buttonRef.current;
        const enter = () =>
          gsap.to(button, {
            y: -3,
            scale: 1.03,
            duration: 0.22,
            ease: "power2.out",
            force3D: true,
          });
        const leave = () =>
          gsap.to(button, {
            y: 0,
            scale: 1,
            duration: 0.22,
            ease: "power2.out",
            force3D: true,
          });

        button.addEventListener("mouseenter", enter);
        button.addEventListener("mouseleave", leave);

        return () => {
          button.removeEventListener("mouseenter", enter);
          button.removeEventListener("mouseleave", leave);
        };
      }

      return () => {
        mm.revert();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-14 sm:py-20 md:py-28"
    >
      {/* Fondo */}
      <div ref={bgRef} className="absolute inset-0">
        <Image
          src="/fondo-capitulo-4.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Viñeta */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        <div ref={headerRef} className="text-center">
          <span className="chapter4-badge font-mono text-xs tracking-[0.3em] uppercase text-ragdoll-cream/70 sm:text-sm">
            Capítulo 4
          </span>

          <p className="chapter4-title font-display mt-2 text-[clamp(2rem,6vw,5rem)] leading-tight text-ragdoll-gold">
            The Final Letter
          </p>

          <p className="chapter4-subtitle font-display mt-2 text-xs leading-tight text-ragdoll-cream/70 sm:text-sm md:text-base">
            Toda historia necesita un final. Escribamos el tuyo juntos.
          </p>
        </div>

        <div
          ref={formWrapperRef}
          className="relative mt-8 rounded-[10px] border border-ragdoll-gold/80 bg-black/50 px-4 py-6 sm:mt-10 sm:rounded-[12px] sm:px-6 sm:py-8 md:mt-14 md:px-8 md:py-10"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[0_0_60px_rgba(0,0,0,0.4)] sm:rounded-[12px]" />

          <form
            ref={formRef}
            className="relative space-y-4 sm:space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="chapter4-field">
              <label
                htmlFor="name"
                className="mb-2 block font-mono text-sm tracking-[0.08em] text-ragdoll-cream sm:mb-3 sm:text-[1.05rem]"
              >
                Tu nombre *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="chapter4-control h-12 w-full rounded-[8px] border border-ragdoll-gold/85 bg-black/35 px-4 text-sm text-ragdoll-cream outline-none placeholder:text-ragdoll-cream/30 sm:h-16 sm:rounded-[10px] sm:px-5 sm:text-base"
              />
            </div>

            <div className="chapter4-field">
              <label
                htmlFor="email"
                className="mb-2 block font-mono text-sm tracking-[0.08em] text-ragdoll-cream sm:mb-3 sm:text-[1.05rem]"
              >
                Tu correo *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="chapter4-control h-12 w-full rounded-[8px] border border-ragdoll-gold/85 bg-black/35 px-4 text-sm text-ragdoll-cream outline-none placeholder:text-ragdoll-cream/30 sm:h-16 sm:rounded-[10px] sm:px-5 sm:text-base"
              />
            </div>

            <div className="chapter4-field">
              <label
                htmlFor="lookingFor"
                className="mb-2 block font-mono text-sm tracking-[0.08em] text-ragdoll-cream sm:mb-3 sm:text-[1.05rem]"
              >
                Qué estás buscando? *
              </label>
              <input
                id="lookingFor"
                name="lookingFor"
                type="text"
                className="chapter4-control h-12 w-full rounded-[8px] border border-ragdoll-gold/85 bg-black/35 px-4 text-sm text-ragdoll-cream outline-none placeholder:text-ragdoll-cream/30 sm:h-16 sm:rounded-[10px] sm:px-5 sm:text-base"
              />
            </div>

            <div className="chapter4-field">
              <label
                htmlFor="message"
                className="mb-2 block font-mono text-sm tracking-[0.08em] text-ragdoll-cream sm:mb-3 sm:text-[1.05rem]"
              >
                Tu mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="chapter4-control min-h-[120px] w-full rounded-[8px] border border-ragdoll-gold/85 bg-black/35 px-4 py-3 text-sm text-ragdoll-cream outline-none placeholder:text-ragdoll-cream/30 sm:min-h-[170px] sm:rounded-[10px] sm:px-5 sm:py-4 sm:text-base"
              />
            </div>

            <div className="chapter4-field flex justify-center pt-1 sm:pt-2">
              <button
                ref={buttonRef}
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-3 rounded-[8px] bg-orange-600 px-8 py-3.5 font-mono text-base tracking-[0.08em] text-white transition-colors hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto sm:min-w-[180px] sm:rounded-[10px] sm:px-10 sm:py-4 sm:text-lg"
              >
                {sending && (
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-100"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                {sending ? "Enviando" : "Enviar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
