"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Quote } from "lucide-react";
import { TahlilStep } from "@/data/prayers";
import { Button } from "@/components/ui/button";

interface TahlilCarouselProps {
    steps: TahlilStep[];
    onBack: () => void;
}

export function TahlilCarousel({ steps, onBack }: TahlilCarouselProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA] min-h-[100vh]">
            {/* Header section with back button and progress indicator */}
            <div className="px-5 pt-12 pb-6 border-b border-[#E8ECE9] bg-white">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-50 flex items-center gap-2">
                        <ChevronLeft size={24} className="text-[#1A2B22]" />
                        <span className="text-[14px] font-bold text-[#1A2B22]">Back to Pustaka</span>
                    </button>
                    <div className="bg-[#EEE9DF] px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/50 shadow-sm">
                        <BookOpen size={14} className="text-[#4D6A53]" strokeWidth={2.5} />
                        <span className="text-[11px] font-bold text-[#4D6A53] uppercase tracking-wide">
                            STEP {currentStep + 1} OF {steps.length}
                        </span>
                    </div>
                </div>

                {/* Step progress dots */}
                <div className="flex gap-1.5 mt-2">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? "w-8 bg-[#4D6A53]" : "w-2 bg-[#E8ECE9]"}`}
                        />
                    ))}
                </div>
            </div>

            {/* Carousel Content Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.4}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -100) nextStep();
                            if (info.offset.x > 100) prevStep();
                        }}
                        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                        className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 flex flex-col items-center text-center relative border border-[#F2F2F2] cursor-grab active:cursor-grabbing"
                    >
                        {/* Decorative Quote Icon bubble */}
                        <div className="absolute top-[-24px] bg-[#4D6A53] p-4 rounded-3xl shadow-lg border-4 border-white">
                            <Quote size={24} className="text-white" fill="white" />
                        </div>

                        <h3 className="text-[1.25rem] font-bold text-[#1A2B22] font-serif mb-10 pt-4 px-2 leading-tight">
                            {steps[currentStep].title}
                        </h3>

                        {/* Arabic Content Area - High visibility */}
                        <div className="w-full bg-[#fdfdfd] rounded-[2rem] p-6 mb-8 border border-[#F8F9F8]">
                            <p className="text-[1.85rem] font-serif leading-[1.8] text-[#1A2B22] dir-rtl">
                                {steps[currentStep].arabic}
                            </p>
                        </div>

                        <div className="w-full px-2">
                            <p className="text-[#5A655F] text-[14px] leading-[1.6] italic font-medium">
                                {steps[currentStep].translation}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation buttons fixed at bottom */}
            <div className="p-8 bg-white/80 backdrop-blur-md border-t border-[#E8ECE9] flex gap-4 items-center justify-between mt-auto">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex-1 h-14 rounded-2xl border-[#E8ECE9] hover:bg-gray-50 text-[#1A2B22] font-bold gap-2 text-[15px] transition-all disabled:opacity-30"
                >
                    <ChevronLeft size={20} strokeWidth={2.5} /> Previous
                </Button>
                <Button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className="flex-1 h-14 bg-[#4D6A53] hover:bg-[#364435] text-white rounded-2xl font-bold shadow-lg shadow-green-900/10 gap-2 text-[15px] transition-all disabled:opacity-30"
                >
                    Next <ChevronRight size={20} strokeWidth={2.5} />
                </Button>
            </div>
        </div>
    );
}
