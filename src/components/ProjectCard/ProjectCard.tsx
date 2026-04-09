import Image from "next/image";

interface ProjectCardProps {
  image: string;
  category: string;
  title: string;
  href: string;
}

export default function ProjectCard({
  image,
  category,
  title,
  href,
}: ProjectCardProps) {
  return (
    <div className="group flex flex-col">
      {/* Card con borde punteado dorado */}
      <div className="rounded-xl border-2 border-dashed border-ragdoll-gold/50 bg-ragdoll-dark-800/60 p-3 transition-all duration-300 group-hover:border-ragdoll-gold sm:rounded-2xl sm:p-4">
        {/* Screenshot — aspect-[3/4] = vertical/portrait */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg sm:rounded-xl">
          <Image
            src={image}
            alt={`Screenshot del proyecto ${title}`}
            width={600}
            height={800}
            className="object-cover object-top"
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, 33vw"
          />
        </div>

        {/* Botón — visible siempre en mobile, hover en desktop */}
        <div className="mt-3 sm:mt-0 sm:max-h-0 sm:overflow-hidden sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:max-h-20 sm:group-hover:opacity-100">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-ragdoll-cream/40 bg-ragdoll-dark-800 px-4 py-2.5 text-center font-mono text-sm text-ragdoll-cream transition-colors hover:border-ragdoll-gold hover:text-ragdoll-gold sm:mt-4 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
          >
            Ver prototipo
          </a>
        </div>
      </div>

      {/* Categoría + Título */}
      <div className="mt-3 px-1 sm:mt-4">
        <span className="font-mono text-xs text-ragdoll-cream/60 sm:text-sm">
          {category}
        </span>
        <h3 className="font-display mt-1 text-xl text-ragdoll-gold sm:text-2xl">
          {title}
        </h3>
      </div>
    </div>
  );
}
