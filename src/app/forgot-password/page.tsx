"use client";

import { PasswordResetForm } from "../../components/password-reset";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { ModeToggle } from "@/components/mode-toggle";

export default function PasswordResetPage() {
    const images = ["/smiling_friends.jpg", "/lady_studying.jpg"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    const handlePrevImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleNextImage();
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentImageIndex, handleNextImage]);

    // Testimonial data
    const testimonial = {
        quote:
            "Security and ease of use make Learniva stand out",
        description:
            "The password recovery process was seamless and secure. I was back to learning within minutes.",
        author: "Jamie Rodriguez",
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
            {/* Theme Toggle Button - Fixed position */}
            <div className="fixed top-4 right-4 z-50">
                <ModeToggle />
            </div>
            
            <div className="flex flex-col w-full max-w-sm sm:max-w-md md:max-w-6xl items-start justify-center relative bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/50 md:flex-row">
                {/* Left Side - Testimonial Section */}
                <div className="hidden lg:flex h-[600px] md:h-[820px] w-full md:w-auto items-center justify-between relative self-stretch md:flex-1">
                    <div className="w-full md:w-[772px] items-center self-stretch flex relative h-full">
                        <div className="flex flex-col items-start justify-between px-8 py-10 flex-1 self-stretch grow rounded-l-3xl md:rounded-l-3xl md:rounded-r-none overflow-hidden relative">
                            {/* Background Image */}
                            <Image
                                src={images[currentImageIndex]}
                                alt="Background Image"
                                fill
                                sizes="(min-width: 768px) 772px, 100vw"
                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                                priority
                            />
                            
                            {/* Gradient overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 z-10" />

                            {/* Logo */}
                            <div className="inline-flex flex-col h-auto items-center justify-center gap-2.5 p-1.5 relative z-20 rounded-lg">
                                <div className="text-white">
                                    <Image
                                        src="/learniva-logo-symbol.svg"
                                        alt="Learniva Symbol Logo"
                                        width={62}
                                        height={56}
                                        style={{ height: 'auto' }}
                                        className="relative brightness-0 invert"
                                    />
                                </div>
                            </div>

                            {/* Testimonial Content */}
                            <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto] z-20 mt-auto">
                                <div className="flex-col w-full items-start gap-4 flex-[0_0_auto] flex relative">
                                    <div className="relative w-full font-bold text-white text-3xl md:text-[42px] leading-tight md:leading-[50px]">
                                        <span className="text-4xl md:text-5xl">&quot;</span>
                                        <br />
                                        <span className="text-3xl md:text-4xl leading-[35px] md:leading-[45px]">
                                            {testimonial.quote}
                                        </span>
                                    </div>
                                </div>

                                <div className="items-end gap-[50px] self-stretch w-full flex-[0_0_auto] flex relative">
                                    <div className="flex-col items-start gap-3 flex-1 grow flex relative">
                                        <div className="relative self-stretch text-white/90 text-base md:text-lg leading-6 md:leading-7">
                                            {testimonial.description}
                                        </div>
                                        <div className="relative self-stretch text-white/70 text-sm md:text-base font-medium leading-5 md:leading-6">
                                            — {testimonial.author}
                                        </div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="w-auto h-auto items-end justify-between flex relative gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-11 h-11 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                                            onClick={handlePrevImage}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-11 h-11 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                                            onClick={handleNextImage}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Password Reset Form Section */}
                <div className="flex flex-col items-center w-full md:items-start justify-center gap-6 sm:gap-8 p-6 sm:p-8 md:p-12 flex-1 self-stretch grow bg-card flex relative md:max-w-md">
                    <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
                        <PasswordResetForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
