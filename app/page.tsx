import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/features/Hero";
import { SocialProof } from "@/components/features/SocialProof";
import { FeaturesGrid } from "@/components/features/FeaturesGrid";
import { BeforeAfterDemo } from "@/components/features/BeforeAfterDemo";
import { Pricing } from "@/components/features/Pricing";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <FeaturesGrid />
        <BeforeAfterDemo />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
