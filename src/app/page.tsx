
import StarField from "@/components/StarField/StarField";
import Hero from "@/components/Hero/Hero";
import ChapterOne from "@/components/Chapters/ChapterOne";
import ChapterTwo from "@/components/Chapters/ChapterTwo";
import ChapterThree from "@/components/Chapters/ChapterThree";
import ChapterFour from "@/components/Chapters/ChapterFour";
import ChapterFive from "@/components/Chapters/ChapterFive";

export default function Home() {
  return (
    <>
      <StarField />

      <main className="relative z-10">
        <Hero />
        <ChapterOne/>
        <ChapterTwo/>
        <ChapterThree/>
        <ChapterFour/>
        <ChapterFive/>
      </main>
    </>
  );
}
