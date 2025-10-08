import Image from "next/image";
import { Lobster } from "next/font/google";
const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });

const Banner = () => {
  return (
    <section className="relative pt-10 w-full min-h-[90vh] flex items-center justify-between px-10 lg:px-20 overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-green-500">
      {/* Big faded background text */}
      <h1 className="absolute text-[24vw] font-extrabold text-white/10 uppercase leading-none left-0 top-1/2 -translate-y-1/2 select-none">
        FAST DELIVERY
      </h1>

      {/* Left text section */}
      <div className="flex flex-col-reverse gap-5 justify-between items-center md:flex-row">
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

          {/* Reviews / rating section */}
          <div className="flex items-center gap-8 md:gap-3">
            <div className="flex -space-x-2">
              <Image
                src="/images/user1.jpg"
                alt="user1"
                width={40}
                height={40}
                className="rounded-full border-2 border-white object-cover"
              />
              <Image
                src="/images/user2.jpg"
                alt="user2"
                width={40}
                height={40}
                className="rounded-full border-2 border-white object-cover"
              />
              <div className="w-10 hidden h-10 bg-white text-green-700 font-bold rounded-full md:flex items-center justify-center border-2 border-white">
                +
              </div>
            </div>
            <div>
              <div className="flex text-yellow-400 text-lg">★★★★★</div>
              <p className="text-sm text-gray-100">
                Trusted delivery for healthy living!
              </p>
            </div>
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
