import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Hero from "@/components/home/Hero";
import Recognise from "@/components/home/Recognise";
import CalcolatoriPreview from "@/components/home/CalcolatoriPreview";
import PercorsoPreview from "@/components/home/PercorsoPreview";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Recognise />
        <CalcolatoriPreview />
        <PercorsoPreview />
        <TestimonialsPreview />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
