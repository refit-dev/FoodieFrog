import Marquee from "react-fast-marquee";

const MarqueeBanner = () => {
  const items = ["hot", "fresh", "pickup", "burger", "fries", "combo", "express"];

  return (
    <div className="bg-white dark:bg-black h-[150px] overflow-hidden flex items-center">
      <Marquee gradient={false} speed={50} pauseOnHover={true} className="h-[150px]">
        {items.map((item, index) => (
          <span
            key={index}
            className="text-[#171717] dark:text-white font-semibold text-5xl mx-4 inline-flex items-center leading-none"
          >
            {item}
            {index < items.length - 1 && (
              <span className="text-green-500 mx-2">*</span>
            )}
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default MarqueeBanner;
