
"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    title: "Track Your Borrows",
    description:
      "Borrow your favorite books, return on time, and renew your reading journey.",
  },
  {
    title: "Discover Your Next Favorite Book",
    description:
      "Explore thousands of amazing books and find your next great read.",
  },
  {
    title: "Read More, Learn More",
    description:
      "Build your personal reading journey with BookNook. Your next adventure starts here.",
  },
];

const Banner = () => {
  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex min-h-100 items-center justify-center bg-[#edf4fc] px-8 py-16 text-center md:min-h-125">
              <div className="max-w-2xl">
                <h1 className="mb-5 text-4xl font-bold leading-tight text-[#192b5c] md:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>

                <p className="mb-8 text-base leading-7 text-[#34446b] md:text-lg">
                  {slide.description}
                </p>

                <Link
                  href="/books"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
                >
                  Browse Books <span>→</span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
