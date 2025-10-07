import MarqueeBanner from "@/components/sections/Marquee";
import Banner from "../components/sections/Banner";

export default function Home() {
  return (
    <div className="mx-auto">
      <Banner />
      <MarqueeBanner/>
    </div>
  );
}
