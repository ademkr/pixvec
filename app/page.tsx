import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/features/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        {/* Section'lar onaylandıkça buraya eklenecek */}
      </main>
    </>
  );
}
