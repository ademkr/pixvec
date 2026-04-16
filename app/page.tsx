import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/features/Hero";
import { SocialProof } from "@/components/features/SocialProof";
import { FeaturesGrid } from "@/components/features/FeaturesGrid";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <FeaturesGrid />
        {/* Section'lar onaylandıkça buraya eklenecek */}
      </main>
    </>
  );
}
