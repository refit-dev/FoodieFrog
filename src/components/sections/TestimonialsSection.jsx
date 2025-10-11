'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sophia Carter',
      location: 'New York, USA',
      content:
        'Absolutely love the food! Everything was fresh, hot, and arrived earlier than expected. My new favorite delivery app!',
      avatar: '/images/user1.jpg',
    },
    {
      id: 2,
      name: 'Liam Johnson',
      location: 'Los Angeles, USA',
      content:
        'Fast and friendly delivery. The burgers were still sizzling when they arrived — amazing quality and taste!',
      avatar: '/images/user2.jpg',
    },
    {
      id: 3,
      name: 'Emily Davis',
      location: 'Chicago, USA',
      content:
        'Super easy ordering experience. Great offers and the food is always perfect. Highly recommended!',
      avatar: '/images/user3.jpg',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            What Our Happy Customers Say
          </h2>
          
        </div>

        {/* Swiper Carousel */}
        <div className="max-w-4xl mx-auto">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: '.testimonial-pagination',
            }}
            loop={true}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-green-50 dark:bg-[#171717] rounded-xl p-8 shadow-md text-center mx-auto max-w-2xl border border-green-100 dark:border-gray-500">
                  <div className="text-green-500 text-4xl mb-2">"</div>
                  <p className="text-gray-700 dark:text-white text-lg mb-6 px-4 italic">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-green-500">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination */}
          <div className="testimonial-pagination flex justify-center mt-8 space-x-2" />
        </div>
      </div>

      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .testimonial-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background-color: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .testimonial-pagination .swiper-pagination-bullet-active {
          background-color: #10b981;
          width: 24px;
          border-radius: 8px;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
