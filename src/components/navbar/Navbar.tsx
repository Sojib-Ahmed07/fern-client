import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-200 px-4 sm:px-6 lg:px-12 transition-all duration-300">
      {/* Left: Brand Logo */}
      <div className="navbar-start">
        <Link
          href="/"
          className="font-serif text-2xl tracking-[0.2em] font-semibold text-neutral hover:opacity-80 transition-opacity"
        >
          FERN
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-8 text-sm font-medium tracking-wide text-base-content/80">
          <li>
            <Link
              href="/all-products"
              className="hover:text-neutral p-0 bg-transparent active:bg-transparent focus:bg-transparent transition-colors duration-200"
            >
              All Products
            </Link>
          </li>
          <li>
            <Link
              href="/categories"
              className="hover:text-neutral p-0 bg-transparent active:bg-transparent focus:bg-transparent transition-colors duration-200"
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:text-neutral p-0 bg-transparent active:bg-transparent focus:bg-transparent transition-colors duration-200"
            >
              About Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Right: Actions (Cart & Profile) */}
      <div className="navbar-end gap-3">
        {/* Shopping Cart */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle btn-sm hover:bg-base-200 transition-colors"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 stroke-[1.5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <span className="badge badge-xs bg-neutral text-neutral-content p-1.5 font-sans border-none scale-90 indicator-item">
                3
              </span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-50 mt-4 w-56 shadow-xl border border-base-200 rounded-xl"
          >
            <div className="card-body p-4">
              <span className="text-sm font-semibold text-base-content/70">
                3 Items in Bag
              </span>
              <span className="text-base font-bold text-neutral">
                Subtotal: $99.00
              </span>
              <div className="card-actions mt-2">
                <Link
                  href="/cart"
                  className="btn btn-neutral btn-block btn-sm rounded-lg capitalize font-medium tracking-wide"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar btn-sm ring-1 ring-base-200 ring-offset-2 hover:bg-base-200 transition-all"
          >
            <div className="w-7 rounded-full">
              <img
                alt="User Profile"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-xl z-50 mt-4 w-52 p-2 shadow-xl border border-base-200"
          >
            <li className="menu-title px-3 py-1 text-xs font-semibold tracking-wider text-base-content/40">
              My Account
            </li>
            <li>
              <Link href="/profile" className="justify-between rounded-lg py-2">
                Profile
                <span className="badge badge-sm bg-base-200 border-none font-medium text-[10px]">
                  New
                </span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className="rounded-lg py-2">
                Settings
              </Link>
            </li>
            <div className="divider my-1 opacity-50"></div>
            <li>
              <button className="rounded-lg py-2 text-error active:bg-error/10 hover:bg-error/10">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
