import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content border-t border-base-300">
      {/* Top Section: Link Directories */}
      <div className="footer max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.2em] font-semibold text-neutral"
          >
            FERN
          </Link>
          <p className="text-sm text-base-content/70 max-w-[200px] leading-relaxed">
            Carefully curated lifestyle goods, rooted in conscious design.
          </p>
        </div>

        {/* Column 2: Shop Links */}
        <div>
          <h6 className="footer-title text-neutral text-xs font-bold tracking-widest opacity-100 mb-3">
            Shop
          </h6>
          <div className="flex flex-col gap-2 text-sm text-base-content/70">
            <Link
              href="/all-products"
              className="hover:text-neutral transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/new-arrivals"
              className="hover:text-neutral transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              href="/bestsellers"
              className="hover:text-neutral transition-colors"
            >
              Bestsellers
            </Link>
          </div>
        </div>

        {/* Column 3: Company Info */}
        <div>
          <h6 className="footer-title text-neutral text-xs font-bold tracking-widest opacity-100 mb-3">
            Our Brand
          </h6>
          <div className="flex flex-col gap-2 text-sm text-base-content/70">
            <Link
              href="/about"
              className="hover:text-neutral transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/sustainability"
              className="hover:text-neutral transition-colors"
            >
              Sustainability
            </Link>
            <Link
              href="/stores"
              className="hover:text-neutral transition-colors"
            >
              Store Locator
            </Link>
          </div>
        </div>

        {/* Column 4: Help/Support */}
        <div>
          <h6 className="footer-title text-neutral text-xs font-bold tracking-widest opacity-100 mb-3">
            Support
          </h6>
          <div className="flex flex-col gap-2 text-sm text-base-content/70">
            <Link href="/faq" className="hover:text-neutral transition-colors">
              FAQ
            </Link>
            <Link
              href="/shipping"
              className="hover:text-neutral transition-colors"
            >
              Shipping & Returns
            </Link>
            <Link
              href="/contact"
              className="hover:text-neutral transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Copyright & Social Handlers */}
      <div className="border-t border-base-300 bg-base-300/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/60 font-medium">
          <div>
            <p>© {new Date().getFullYear()} FERN Inc. All rights reserved.</p>
          </div>

          {/* Social Icons Placeholder */}
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-neutral transition-colors">
              Pinterest
            </a>
            <a href="#" className="hover:text-neutral transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
