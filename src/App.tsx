import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Tracks } from "./components/Tracks";
import { VideoLab } from "./components/VideoLab";
import { Streaming } from "./components/Streaming";
import { Label } from "./components/Label";
import { Footer } from "./components/Footer";
import { ReleaseModal } from "./components/ReleaseModal";
import { LangContext, type Lang } from "./lib/i18n";
import type { Release } from "./data/artist";

export default function App({ lang = "en" }: { lang?: Lang }) {
  const [activeRelease, setActiveRelease] = useState<Release | null>(null);

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-ink-950 text-gray-100 antialiased">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Tracks onOpenRelease={setActiveRelease} />
          <VideoLab />
          <Streaming />
          <Label />
        </main>
        <Footer />
        <ReleaseModal
          release={activeRelease}
          onClose={() => setActiveRelease(null)}
        />
      </div>
    </LangContext.Provider>
  );
}
