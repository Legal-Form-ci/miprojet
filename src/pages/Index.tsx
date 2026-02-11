import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { PartnershipBanner } from "@/components/PartnershipBanner";
import { StatsSection } from "@/components/StatsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ServicesSection } from "@/components/ServicesSection";
import { FundingTypes } from "@/components/FundingTypes";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { LatestNews } from "@/components/LatestNews";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Features } from "@/components/Features";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { WelcomePopup } from "@/components/WelcomePopup";
import { MembershipBanner } from "@/components/MembershipBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <WelcomePopup />
      <Navigation />
      <Hero />
      <PartnershipBanner />
      <LatestNews />
      <MembershipBanner />
      <StatsSection />
      <HowItWorks />
      <ServicesSection />
      <FundingTypes />
      <FeaturedProjects />
      <TestimonialsSection />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
