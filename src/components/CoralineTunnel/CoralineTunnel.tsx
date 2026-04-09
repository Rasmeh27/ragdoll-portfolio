"use client";

/*
  CoralineTunnel — Transición tipo portal entre Capítulo 1 y 2

  CÓMO FUNCIONA:
  En vez de anillos CSS, usamos 9 frames reales del túnel (imágenes).
  Todos los frames están apilados (position absolute) uno encima de otro.
  
  GSAP ScrollTrigger controla qué frame es visible según el progreso del scroll:
  - Frame 1 (vórtice abierto) → visible al inicio
  - Frame 9 (oscuridad total) → visible al final
  
  TÉCNICA:
  - Todos los frames empiezan con opacity: 0 excepto el primero
  - Conforme scrolleas, el frame actual hace fade out y el siguiente fade in
  - Esto crea una animación fluida tipo "stop motion" controlada por scroll
  
  CONCEPTOS GSAP:
  - pin: true → fija la sección en pantalla mientras dura la animación
  - scrub: true → vincula directamente al scroll (sin suavizado para que sea responsive)
  - end: "+=150%" → la animación dura 1.5x el viewport de scroll
*/

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 9;
const frames = Array.from({ length: FRAME_COUNT }, (_, i) => `/Tunel/frame${i + 1}.png`);

export default function CoralineTunnel() {
  const tunnelRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const frameEls = framesRef.current.filter(Boolean) as HTMLDivElement[];

      /*
        Timeline principal:
        Dividimos el scroll en segmentos iguales.
        En cada segmento, el frame actual desaparece y el siguiente aparece.
        
        Con 9 frames tenemos 8 transiciones.
        Cada transición ocupa 1/8 del timeline (0.125)
      */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: tunnelRef.current,
          start: "top top",
          end: "+=150%",          // Ajusta: más % = más scroll necesario
          pin: true,
          scrub: true,            // true = sin suavizado, responde directo al scroll
          // markers: true,       // Descomenta para debug
        },
      });

      // Por cada par de frames consecutivos, crear una transición
      for (let i = 0; i < frameEls.length - 1; i++) {
        const segmentStart = i / (frameEls.length - 1);

        // Frame actual: fade out
        tl.to(
          frameEls[i],
          {
            opacity: 0,
            duration: 1 / (frameEls.length - 1),
            ease: "none",         // Linear — el scroll ya provee la curva
          },
          segmentStart
        );

        // Frame siguiente: fade in
        tl.to(
          frameEls[i + 1],
          {
            opacity: 1,
            duration: 1 / (frameEls.length - 1),
            ease: "none",
          },
          segmentStart
        );
      }
    },
    { scope: tunnelRef }
  );

  return (
    <div
      ref={tunnelRef}
      className="relative h-screen w-full overflow-hidden bg-ragdoll-dark"
      aria-hidden="true"
    >
      {frames.map((src, i) => (
        <div
          key={src}
          ref={(el) => { framesRef.current[i] = el; }}
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0 }}  // Solo el primer frame visible
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={i < 2}      // Precarga los primeros 2 frames
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
}
