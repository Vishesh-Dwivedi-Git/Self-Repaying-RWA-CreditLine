import HeroFlow from "@/components/HeroFlow";
import { RWAIntelligence } from "@/components/RWAIntelligence";
import { SecurityFeature } from "@/components/landing/SecurityFeature";
import { TransparencySection } from "@/components/landing/TransparencySection";
import { BuilderGrid } from "@/components/landing/BuilderGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#C3F53C]/30 selection:text-[#C3F53C]">
      <HeroFlow />
      <RWAIntelligence />
      <SecurityFeature />
      <TransparencySection />
      <BuilderGrid />
      <Footer />
    </main>
  );
}
