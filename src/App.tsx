import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Tracks } from "./components/Tracks";
import { Streaming } from "./components/Streaming";
import { Label } from "./components/Label";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-ink-950 text-gray-100 antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Tracks />
        <Streaming />
        <Label />
      </main>
      <Footer />
    </div>
  );
}
