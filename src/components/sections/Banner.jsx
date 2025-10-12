import Image from "next/image";
import { Lobster } from "next/font/google";
import { Bike } from "lucide-react";
import Link from "next/link";
const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });

const Banner = () => {
  return (
    <section className="relative pt-10 w-full min-h-[90vh] flex items-center justify-between px-10 lg:px-20 overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-green-500">
      {/* Big faded background text */}
      <h1 className="absolute text-[24vw] font-extrabold text-white/10 uppercase leading-none left-0 top-1/2 -translate-y-1/2 select-none">
        FAST DELIVERY
      </h1>

      {/* Left text section */}
      <div className="flex flex-col-reverse container mx-auto gap-5 md:justify-between items-center md:flex-row">
        <div className="relative z-10 text-white max-w-xl">
          <h2
            className={`${lobster.className} text-5xl lg:text-7xl font-bold leading-tight mb-6`}
          >
            It’s hot. <br /> Delicious. <br /> Fast.
          </h2>
          <p className="text-gray-100 text-lg mb-10">
            Burgers, pizza, fries, drinks — we’ll deliver in just 30 minutes. No
            queues. No stress.
          </p>

          {/* Order Now Button */}
          <div className="relative inline-block group">
            <Link
              href={"/restaurants"}
              className="relative z-10 flex items-center gap-2 px-8 py-3 text-lg font-semibold text-black bg-white rounded-full transition-all duration-300 hover:bg-transparent hover:text-white border-2 border-white"
            >
              <Bike className="w-5 h-5" />
              <span>Order Now</span>
            </Link>
          </div>
        </div>
        {/* Right burger image */}
        <div className="relative z-10 mt-10 lg:mt-0">
          <Image
            src="/images/hero-burger.png" // 🔁 Replace this with your burger image link
            alt="Burger and Drink"
            width={600}
            height={600}
            className="drop-shadow-2xl object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
