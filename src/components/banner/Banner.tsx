import Link from "next/link";

const BannerSlider = () => {
  // Slider data array to keep the code organized and easy to edit
  const slides = [
    {
      id: "slide1",
      next: "slide2",
      prev: "slide3",
      image:
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop",
      title: "The Summer Collection",
      subtitle:
        "Bring nature indoors with our curated earthy tones and organic textures.",
      ctaText: "Shop New Arrivals",
      ctaLink: "/all-products",
    },
    {
      id: "slide2",
      next: "slide3",
      prev: "slide1",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
      title: "Mindful Living Essentials",
      subtitle:
        "Handcrafted, ethically-sourced home accents designed to last a lifetime.",
      ctaText: "Explore Sustainability",
      ctaLink: "/about",
    },
    {
      id: "slide3",
      next: "slide1",
      prev: "slide2",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2064&auto=format&fit=crop",
      title: "Minimalist Workspaces",
      subtitle:
        "Declutter your environment with our premium wooden organizer variants.",
      ctaText: "View Home Decor",
      ctaLink: "/categories",
    },
  ];

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-0 sm:px-4 md:px-6 lg:px-12 my-4 md:my-8">
      {/* DaisyUI Carousel Container */}
      <div className="carousel w-full h-[450px] sm:h-[550px] md:h-[650px] rounded-none sm:rounded-2xl overflow-hidden shadow-sm">
        {slides.map((slide) => (
          <div
            key={slide.id}
            id={slide.id}
            className="carousel-item relative w-full h-full"
          >
            {/* Background Image with Dark/Muted Overlay */}
            <div className="absolute inset-0 bg-neutral-900/40 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-700 hover:scale-105"
            />

            {/* Content Container (Perfectly Centered or Left Aligned) */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-8 sm:px-16 md:px-24 lg:px-32 text-neutral-content max-w-3xl">
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-white/80 mb-3 animate-fade-in">
                FERN Premium
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-wide leading-tight mb-4">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base text-white/80 max-w-lg font-light leading-relaxed mb-8">
                {slide.subtitle}
              </p>
              <Link
                href={slide.ctaLink}
                className="btn btn-white bg-white text-neutral hover:bg-neutral hover:text-white border-none rounded-lg px-6 sm:px-8 capitalize font-medium tracking-wide shadow-md transition-all"
              >
                {slide.ctaText}
              </Link>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 z-30 flex justify-between pointer-events-none">
              <a
                href={`#${slide.prev}`}
                className="btn btn-circle btn-sm bg-white/20 hover:bg-white/40 border-none text-white pointer-events-auto backdrop-blur-sm transition-colors"
              >
                ❮
              </a>
              <a
                href={`#${slide.next}`}
                className="btn btn-circle btn-sm bg-white/20 hover:bg-white/40 border-none text-white pointer-events-auto backdrop-blur-sm transition-colors"
              >
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
