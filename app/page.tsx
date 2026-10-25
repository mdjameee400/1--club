import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Showcase from "@/components/Showcase";
import Story from "@/components/Story";
import Craft from "@/components/Craft";
import Recipes from "@/components/Recipes";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Showcase />
        <Story />
        <Craft />
        <Recipes />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
