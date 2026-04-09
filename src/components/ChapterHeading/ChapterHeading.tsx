interface ChapterHeadingPropos {
    number: string;
    title: string;
}

export default function ChapterHeading({number, title}: ChapterHeadingPropos) {
    return(
        <div className="mb-4 text-center sm:mb-6 md:mb-8">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-ragdoll-cream/70 sm:text-sm">
                Capítulo {number}
            </span>

            <h2 className="font-display mt-1.5 text-[clamp(2rem,6vw,5rem)] leading-tight text-ragdoll-gold sm:mt-2">
                {title}
            </h2>
        </div>
    )
}