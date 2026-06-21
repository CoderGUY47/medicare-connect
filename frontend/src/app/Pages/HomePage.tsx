"use client";

import React from "react";
import HeroSection from "../../components/HeroSection";
import ServicePortals from "../../components/ServicePortals";
import SpecializationsSection from "../../components/SpecializationsSection";
import FeaturedDoctorsSection from "../../components/FeaturedDoctorsSection";
import CapabilitiesSection from "../../components/CapabilitiesSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import ContactForm from "../../components/ContactForm";
import ScrollAnimate from "../../components/ScrollAnimate";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Service Portals Section */}
      <ScrollAnimate>
        <ServicePortals />
      </ScrollAnimate>

      {/* 3. Specializations Section */}
      <SpecializationsSection />

      {/* 4. Featured Verified Doctors Section */}
      <FeaturedDoctorsSection />

      {/* 5. System Capabilities Section */}
      <CapabilitiesSection />

      {/* 6. Testimonials Reviews Carousel Section */}
      <TestimonialsSection />

      {/* 7. Contact Form Section */}
      <ContactForm />
    </div>
  );
}
