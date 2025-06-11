"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote, Pause, Play } from "lucide-react";

// Define TypeScript interfaces for testimonials
interface Testimonial {
  src: string;
  alt: string;
  quote: string;
  description: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    src: "/learniva_user.svg",
    alt: "A woman in a striped shirt looking at her laptop in a well-lit room.",
    quote: "Learniva has saved me countless hours of work and helped me speed up",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Sofia Davis",
  },
  {
    src: "/learniva_theme.svg",
    alt: "An abstract graphic representing AI and learning.",
    quote: "The AI-powered features are a game-changer for my productivity.",
    description:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec velit neque, auctor sit amet aliquam vel.",
    author: "John Doe",
  },
];

export function LoginCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isImageError, setIsImageError] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, []);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
      touchStartX.current = null;
    }
  };

  // Autoplay effect
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused, handleNext]);

  // Handle image load error
  const handleImageError = () => {
    setIsImageError(true);
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <div
      ref={carouselRef}
      className="relative h-full w-full overflow-hidden rounded-4xl shadow-2xl ml-10 p-8 mt-12 mb-50 md:ml-12 lg:ml-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonial carousel"
    >
      {/* Logo Symbol */}
      <div className="absolute left-8 top-8 z-20">
        <Image
          src="/symbol.png"
          alt="Learniva Symbol"
          width={48}
          height={48}
          priority
          className="drop-shadow-md"
        />
      </div>

      {/* Carousel slides */}
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          role="tabpanel"
          aria-hidden={index !== currentIndex}
          id={`slide-${index}`}
          aria-labelledby={`control-${index}`}
        >
          {!isImageError ? (
            <Image
              src={testimonial.src}
              alt={testimonial.alt}
              fill
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content and Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 text-white sm:p-10 lg:p-12">
        <div className="flex flex-col gap-6">
          {/* Testimonial Content */}
          <div className="max-w-md lg:max-w-lg">
            <Quote
              className="h-12 w-12 text-white/30 mb-4"
              fill="currentColor"
              aria-hidden="true"
            />
            <blockquote className="text-xl font-semibold tracking-tight mb-3 md:text-2xl">
              {activeTestimonial.quote}
            </blockquote>
            <p className="text-sm text-white/70 mb-4 leading-relaxed md:text-base">
              {activeTestimonial.description}
            </p>
            <footer className="text-base font-medium">
              — {activeTestimonial.author}
            </footer>
          </div>

          {/* Navigation and Progress */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-white w-8" : "bg-white/40"
                  } hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === currentIndex}
                  id={`control-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}