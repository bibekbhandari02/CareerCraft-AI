import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { HiDownload } from "react-icons/hi";

export default function PortfolioNavbar({ 
  portfolio, 
  content, 
  scrollToSection, 
  activeSection, 
  setActiveSection 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Detect scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll spy - detect active section
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = navLinks.map((link) => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionBottom = sectionTop + rect.height;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const newActiveMenu = navLinks[i].id;
            if (activeSection !== newActiveMenu) {
              setActiveSection(newActiveMenu);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [activeSection, setActiveSection]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 origin-left z-50"
        style={{
          scaleX,
          height: "2px",
          background: "linear-gradient(to right, var(--theme-primary), var(--theme-secondary))",
          boxShadow: "none",
        }}
      />

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-lg py-3"
            : "backdrop-blur-sm bg-black/20 border-b border-white/5 py-4"
        }`}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              scrollToSection("home");
              setActiveSection("home");
            }}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            {portfolio?.logoUrl ? (
              <img
                src={portfolio.logoUrl}
                alt="Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            ) : (
              <svg 
                width="140" 
                height="48" 
                viewBox="0 0 140 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 md:h-12 w-auto"
              >
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'var(--theme-primary)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--theme-secondary)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <text 
                  x="5" 
                  y="32" 
                  fontSize="32" 
                  fontWeight="800" 
                  fill="url(#logoGradient)"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  letterSpacing="-1"
                >
                  {content?.hero?.title?.[0]?.toUpperCase() || 'P'}
                </text>
                <text 
                  x="30" 
                  y="32" 
                  fontSize="24" 
                  fontWeight="600" 
                  fill="white"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  letterSpacing="0.5"
                >
                  {content?.hero?.title?.split(' ')[0]?.slice(1)?.toLowerCase() || 'ortfolio'}
                </text>
              </svg>
            )}
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <li key={item.id} className="relative">
                <button
                  onClick={() => {
                    scrollToSection(item.id);
                    setActiveSection(item.id);
                  }}
                  className={`px-3 lg:px-4 py-2 text-sm md:text-base lg:text-lg font-medium transition-all duration-200 rounded-lg relative group ${
                    activeSection === item.id
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                  {/* Hover underline effect */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 ${
                      activeSection === item.id
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Download CV Button - Desktop */}
            {portfolio?.resumeUrl && (
              <a
                href={portfolio.resumeUrl}
                download
                className="hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-sm md:text-base lg:text-lg text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105"
              >
                <HiDownload className="w-4 h-4" />
                <span>Download CV</span>
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none relative z-[110] p-2"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-white rounded-full transition-all"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-white rounded-full transition-all"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-white rounded-full transition-all"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed top-0 left-0 w-full h-screen bg-black/80 backdrop-blur-sm z-[90]"
                style={{ height: "100vh", minHeight: "100vh" }}
                onClick={() => setMenuOpen(false)}
              />

              {/* Side Menu */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-screen w-[85%] max-w-[320px] bg-gradient-to-b from-gray-900/95 via-primary-950/30 to-black/95 backdrop-blur-xl z-[95] p-6 pt-20 shadow-2xl border-l border-primary-500/20 overflow-y-auto"
                style={{ height: "100vh" }}
              >
                {/* Mobile Nav Links */}
                <ul className="space-y-2 mb-8">
                  {navLinks.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <button
                        onClick={() => {
                          scrollToSection(item.id);
                          setActiveSection(item.id);
                          setMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border border-primary-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>

                {/* Mobile CTA Button */}
                {portfolio?.resumeUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <a
                      href={portfolio.resumeUrl}
                      download
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-base text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                      onClick={() => setMenuOpen(false)}
                    >
                      <HiDownload className="w-5 h-5" />
                      <span>Download CV</span>
                    </a>
                  </motion.div>
                )}

                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-500/10 to-transparent pointer-events-none" />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
