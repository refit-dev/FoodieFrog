import { Button } from '@/components/ui/button';
import React from 'react';

export default function AboutUs() {
  return (
    <div className="pt-[64px]">
      {/* top section with bg */}
      <div className="relative min-h-[70vh] max-h-[75vh] bg-[url(/about.jpg)] bg-cover bg-center flex justify-center items-center">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>

        {/* text */}
        <div className="text-4xl text-white md:text-6xl font-bold text-center z-10">
          About <br /> FoodieFrog
        </div>
      </div>

      {/* text section */}
      <div className="my-10 sm:my-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center">
          Deliver <del>Food</del> Emotion
        </h1>
        <div className="flex justify-center my-6">
          <h2 className="text-4xl text-center max-w-[90%] sm:max-w-[60%]">
            From food delivery to your daily convenience companion.
          </h2>
        </div>
        <div className="flex justify-center">
          <div className="space-y-4 max-w-[90%] sm:max-w-[60%]">
            <p className="text-center">
              A subsidiary of Delivery Hero, FoodieFrog launched in Bangladesh
              in 2024 as a food delivery platform. Dedicated to helping
              customers get their tasty favorite fast, it quickly won the hearts
              and minds of customers in APAC.
            </p>
            <p className="text-center">
              Powered by tech and operational excellence, FoodieFrog has been
              growing its quick-commerce footprint in more than 400 cities
              across 11 markets in Asia – Singapore, Hong Kong, Thailand,
              Malaysia, Pakistan, Taiwan, Philippines, Bangladesh, Laos,
              Cambodia, and Myanmar.
            </p>
            <p className="text-center">
              Thanks to dedicated partners, riders, and a team united by shared
              values, FoodieFrog is now providing millions with a convenient way
              to get food and groceries in a few taps.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg  leading-relaxed">
                To revolutionize food delivery by connecting hungry customers
                with their favorite restaurants through innovative technology,
                ensuring every meal arrives fresh, hot, and on time while
                supporting local businesses and communities.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg  leading-relaxed">
                To become the most trusted and beloved food delivery platform in
                Asia, creating a seamless ecosystem where technology meets
                culinary excellence, and every delivery brings joy to both
                customers and restaurant partners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-xl  max-w-3xl mx-auto">
              These values guide everything we do, from how we treat our
              customers to how we build our technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Customer First */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Customer First</h3>
              <p className="">
                Every decision we make is guided by what's best for our
                customers and their dining experience.
              </p>
            </div>

            {/* Innovation */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="">
                We continuously innovate to make food delivery faster, smarter,
                and more convenient.
              </p>
            </div>

            {/* Quality */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality</h3>
              <p className="">
                We maintain the highest standards in food quality, delivery
                service, and customer care.
              </p>
            </div>

            {/* Community */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="">
                We support local restaurants and communities, helping them
                thrive in the digital economy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl  max-w-3xl mx-auto">
              Numbers that tell the story of our growth and the trust our
              customers place in us.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-2">
                400+
              </div>
              <div className="text-lg ">Cities Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2">
                50M+
              </div>
              <div className="text-lg ">Orders Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-purple-400 mb-2">
                100K+
              </div>
              <div className="text-lg ">Restaurant Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-2">
                11
              </div>
              <div className="text-lg ">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership/Team Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Leadership Team
            </h2>
            <p className="text-xl  max-w-3xl mx-auto">
              Meet the passionate leaders driving FoodieFrog's mission to
              revolutionize food delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">AS</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Ahmed Sarker</h3>
              <p className="text-green-600 font-semibold mb-2">CEO & Founder</p>
              <p className=" text-sm">
                Visionary leader with 15+ years in tech and logistics,
                passionate about connecting communities through food.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">RK</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Rahima Khan</h3>
              <p className="text-green-600 font-semibold mb-2">CTO</p>
              <p className=" text-sm">
                Technology innovator focused on building scalable systems that
                power seamless food delivery experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">MH</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Mohammad Hassan</h3>
              <p className="text-green-600 font-semibold mb-2">COO</p>
              <p className=" text-sm">
                Operations expert ensuring every delivery meets our high
                standards of quality and timeliness.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Join Our Journey
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're a customer, restaurant partner, or delivery rider,
            there's a place for you in the FoodieFrog family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className='cursor-pointer'>
              Join Us Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
