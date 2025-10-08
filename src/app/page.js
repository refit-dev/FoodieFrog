import MarqueeBanner from "@/components/sections/Marquee";
import Banner from "../components/sections/Banner";
import FeaturesSection from "@/components/sections/FeatureSection";

export default function Home() {
  return (
    <div className="mx-auto">
      <Banner />
      <MarqueeBanner/>
      <FeaturesSection/>
    </div>
  );
}
