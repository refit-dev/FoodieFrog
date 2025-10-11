"use client";
import { Percent, CreditCard, Timer } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="bg-white dark:bg-black py-16">
      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-10 text-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-gray-800">
          <div className="mb-4 bg-green-100 p-4 rounded-full">
            <Percent size={50} className="text-green-600" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold dark:text-white text-green-800 mb-2">
            Choose your meals
          </h3>
          <p className="text-gray-500 text-sm md:text-base max-w-xs">
            Pick fresh, tasty dishes from our menu and enjoy healthy food at home.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-gray-800">
          <div className="mb-4 bg-green-100 p-4 rounded-full">
            <CreditCard size={50} className="text-green-600" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold dark:text-white text-green-800 mb-2">
            Pay online or on delivery
          </h3>
          <p className="text-gray-500 text-sm md:text-base max-w-xs">
            Pay with card or cash—your order is safe and easy every single time.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-gray-800">
          <div className="mb-4 bg-green-100 p-4 rounded-full">
            <Timer size={50} className="text-green-600" />
          </div>
          <h3 className="text-lg md:text-xl dark:text-white font-semibold text-green-800 mb-2">
            Delivery time 30 min
          </h3>
          <p className="text-gray-500 text-sm md:text-base max-w-xs">
            Get your food and water fast—our team brings it to your door in minutes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
