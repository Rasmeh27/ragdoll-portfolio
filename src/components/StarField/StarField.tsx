"use client";

/*
  StarField — Fondo de estrellas animadas con Canvas API

  "use client" porque:
  1. Usa useRef para acceder al elemento <canvas> del DOM
  2. Usa useEffect para ejecutar código después del render (animación)
  3. Usa useState para el tamaño de la ventana

  El canvas se posiciona fixed para que cubra toda la pantalla
  y quede detrás del contenido (z-0).
*/

import { useRef, useEffect, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number; // Velocidad de parpadeo única por estrella
  twinkleOffset: number; // Fase inicial aleatoria
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);

  // Genera un array de estrellas con propiedades aleatorias
  const generateStars = useCallback((width: number, height: number): Star[] => {
    const count = Math.floor((width * height) / 8000); // Densidad proporcional
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5, // 0.5px a 2.5px
      opacity: Math.random() * 0.7 + 0.3, // 0.3 a 1.0
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2, // Fase entre 0 y 2π
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Chequeo de reduced-motion: si está activo, dibujamos estrellas estáticas
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Ajustar canvas al tamaño de la ventana
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = generateStars(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Si reduced-motion, dibuja una vez y no anima
    if (prefersReducedMotion) {
      starsRef.current.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 240, 230, ${star.opacity})`;
        ctx.fill();
      });
      return () => window.removeEventListener("resize", resize);
    }

    // Loop de animación: las estrellas parpadean con sin()
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        // sin() oscila entre -1 y 1, lo mapeamos a rango de opacidad
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = star.opacity * (0.6 + twinkle * 0.4);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 240, 230, ${currentOpacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup: detener animación y remover listener al desmontar
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [generateStars]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true" // Decorativo, no relevante para screen readers
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
