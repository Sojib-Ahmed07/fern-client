import BannerSlider from "@/components/banner/Banner";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Navbar />
      <main className="flex-grow">
        <BannerSlider />
      </main>
      <Footer />
    </div>
  );
}
