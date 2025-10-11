import MarqueeBanner from "@/components/sections/Marquee";
import Banner from "../components/sections/Banner";
import FeaturesSection from "@/components/sections/FeatureSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import RestaurantCarousel from "@/components/sections/TopRatedRest";
import BrandPartners from "@/components/sections/BrandPartners";

export default function Home() {
  return (
    <div className="mx-auto">
      <Banner />
      <MarqueeBanner/>
      <RestaurantCarousel/>
      <FeaturesSection/>
      <TestimonialsSection/>
      <BrandPartners/>
    </div>
  );
}
