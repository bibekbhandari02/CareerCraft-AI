import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, Linkedin, Github, ExternalLink, Eye, Code2, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import api from '../lib/api';
import { getThemeColors, applyThemeVariables } from '../utils/portfolioThemes';
import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaDatabase,
  FaJava,
  FaPython,
  FaPhp,
  FaDocker,
  FaAws,
  FaVuejs,
  FaAngular,
  FaSass,
  FaBootstrap,
  FaGitAlt,
  FaLinux,
  FaNpm,
  FaYarn,
  FaFigma,
  FaSwift,
  FaAndroid,
  FaApple,
  FaInfinity,
} from 'react-icons/fa';
import {
  SiJavascript,
  SiMongodb,
  SiExpress,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiRedux,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiFirebase,
  SiDjango,
  SiFlask,
  SiSpring,
  SiLaravel,
  SiRubyonrails,
  SiGo,
  SiRust,
  SiCplusplus,
  SiKubernetes,
  SiGooglecloud,
  SiGitlab,
  SiJenkins,
  SiNginx,
  SiFlutter,
  SiKotlin,
  SiGraphql,
  SiJest,
  SiWebpack,
  SiVite,
  SiPostman,
  SiVercel,
  SiNetlify,
  SiHeroku,
} from 'react-icons/si';
import { TbBrandReactNative, TbBrandCSharp } from 'react-icons/tb';
import ModernTemplate from '../components/portfolio-templates/ModernTemplate';
import MinimalTemplate from '../components/portfolio-templates/MinimalTemplate';
import CreativeTemplate from '../components/portfolio-templates/CreativeTemplate';
import ProfessionalTemplate from '../components/portfolio-templates/ProfessionalTemplate';
import { getSkillIcon } from '../utils/skillIcons';

export default function PortfolioView() {
  const { subdomain } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Set default filter based on screen size: 'recent' for mobile, 'all' for desktop
  const [projectFilter, setProjectFilter] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'recent' : 'all'
  );

  // Get unique tags from projects
  const projectTags = portfolio?.content?.projects 
    ? ['all', 'recent', ...new Set(portfolio.content.projects.map(p => p.tag).filter(Boolean))]
    : ['all', 'recent'];

  // Get theme colors
  const themeColors = portfolio ? getThemeColors(portfolio.colorTheme) : getThemeColors('purple-pink');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Prevent double fetch in React StrictMode
  const hasFetched = useRef(false);
  
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchPortfolio();
    }
  }, [subdomain]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionBottom = sectionTop + rect.height;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [menuOpen]);

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get(`/portfolio/public/${subdomain}`);
      setPortfolio(data.portfolio);
      
      // Portfolio view tracking is done server-side
    } catch (error) {
      console.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">ðŸ”</div>
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio Not Found</h1>
          <p className="text-gray-400 text-lg">This portfolio doesn't exist or hasn't been published yet.</p>
        </div>
      </div>
    );
  }

  const { content, colors } = portfolio;
  const navLinks = ['home', 'about', 'skills', 'projects', 'contact'];

  return (
    <>
      {/* Apply theme CSS variables globally */}
      <style>{`
        :root {
          ${Object.entries(applyThemeVariables(portfolio.colorTheme))
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n          ')}
        }
        
        /* Hide scrollbar completely */
        html, body {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
          width: 0;
          height: 0;
        }
        
        /* Theme-aware styles */
        .theme-gradient {
          background-image: linear-gradient(to right, var(--theme-primary), var(--theme-secondary));
        }
        .theme-gradient-hover:hover {
          background-image: linear-gradient(to right, var(--theme-primary-hover), var(--theme-secondary-hover));
        }
        .theme-bg { background-color: var(--theme-background); }
        .theme-surface { background-color: var(--theme-surface); }
        .theme-border { border-color: var(--theme-border); }
        .theme-text { color: var(--theme-text); }
        .theme-text-secondary { color: var(--theme-text-secondary); }
        .theme-skill-badge {
          background-color: var(--theme-skill-bg);
          border: 1px solid var(--theme-skill-border);
          color: var(--theme-accent);
        }
      `}</style>
      
      <div 
        className="min-h-screen text-white relative overflow-hidden theme-bg"
      >
      {/* Global Glowing Background Orbs - Stable (no pulse) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 origin-left z-50"
        style={{ 
          scaleX, 
          height: '2px',
          backgroundColor: 'var(--theme-primary)',
          boxShadow: 'none'
        }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 backdrop-blur-sm z-[100]" style={{ 
        backgroundColor: portfolio.template === 'minimal' ? 'rgba(255, 255, 255, 0.9)' : 'var(--theme-background)E6', 
        borderBottom: portfolio.template === 'minimal' ? '1px solid #e5e5e5' : '1px solid var(--theme-border)' 
      }}>
        <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            {portfolio.logoUrl ? (
              <img
                src={portfolio.logoUrl}
                alt={`${content.hero?.title} Logo`}
                className="h-10 md:h-12 w-auto object-contain"
              />
            ) : (
              (() => {
                const logoText = portfolio.logoText || content.hero?.title?.split(' ')[0] || 'Logo';
                const firstLetter = logoText[0]?.toUpperCase() || 'L';
                const restOfWord = logoText.slice(1)?.toLowerCase() || 'ogo';
                
                return (
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
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <text 
                      x="5" 
                      y="32" 
                      fontSize="32" 
                      fontWeight="800" 
                      fill="url(#logoGradient)"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      filter="url(#glow)"
                      letterSpacing="-1"
                    >
                      {firstLetter}
                    </text>
                    <text 
                      x="30" 
                      y="32" 
                      fontSize="24" 
                      fontWeight="600" 
                      fill={portfolio.template === 'minimal' ? 'black' : 'white'}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      letterSpacing="0.5"
                    >
                      {restOfWord}
                    </text>
                  </svg>
                );
              })()
            )}
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <li key={item} className="relative">
                <button
                  onClick={() => scrollToSection(item)}
                  className={`text-lg capitalize transition-colors duration-200 ${
                    portfolio.template === 'minimal'
                      ? activeSection === item
                        ? 'text-black font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                      : activeSection === item
                      ? 'text-white font-semibold'
                      : 'text-[#888888] hover:text-gray-300'
                  }`}
                >
                  {item}
                </button>
                {activeSection === item && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-1 rounded theme-gradient"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button & Views */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Eye className={`w-4 h-4 ${portfolio.template === 'minimal' ? 'text-gray-700' : ''}`} style={{ color: portfolio.template === 'minimal' ? undefined : 'var(--theme-primary)' }} />
              <span className={portfolio.template === 'minimal' ? 'text-gray-700' : 'text-gray-400'}>{portfolio.views}</span>
            </div>
            
            <button
              className="md:hidden focus:outline-none relative z-[110]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? (
                <svg className={`w-8 h-8 ${portfolio.template === 'minimal' ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className={`w-8 h-8 ${portfolio.template === 'minimal' ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
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
                className={`fixed top-0 left-0 w-full h-screen z-[90] ${
                  portfolio.template === 'minimal' 
                    ? 'bg-black/20' 
                    : 'bg-black/60'
                }`}
                style={{ height: '100vh', minHeight: '100vh' }}
                onClick={() => setMenuOpen(false)}
              />
              
              {/* Side Menu */}
              <motion.ul
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`fixed top-0 right-0 h-screen w-[280px] z-[95] p-8 space-y-6 pt-24 shadow-2xl overflow-y-auto ${
                  portfolio.template === 'minimal'
                    ? 'bg-white border-l border-gray-200'
                    : 'backdrop-blur-2xl bg-[#0a0a0a]/95 border-l border-white/10'
                }`}
                style={{ height: '100vh' }}
              >
                {navLinks.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        scrollToSection(item);
                        setMenuOpen(false);
                      }}
                      className={`block text-lg capitalize cursor-pointer transition-all relative ${
                        portfolio.template === 'minimal'
                          ? activeSection === item
                            ? 'text-black font-semibold'
                            : 'text-gray-600 hover:text-gray-900'
                          : activeSection === item
                          ? 'text-transparent bg-clip-text theme-gradient font-semibold'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={activeSection === item && portfolio.template !== 'minimal' ? {
                        backgroundImage: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      } : {}}
                    >
                      {item}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Render Complete Template */}
      {(() => {
        const templateProps = {
          portfolio,
          content,
          scrollToSection,
          getSkillIcon,
          projectFilter,
          setProjectFilter,
          projectTags,
          setSelectedProject,
          setIsModalOpen
        };

        // Debug: Log current template
        console.log('Current template:', portfolio.template);

        const currentTemplate = portfolio.template || 'professional';

        switch (currentTemplate) {
          case 'minimal':
            return <MinimalTemplate {...templateProps} />;
          case 'creative':
            return <CreativeTemplate {...templateProps} />;
          case 'modern':
            return <ModernTemplate {...templateProps} />;
          case 'professional':
            return <ProfessionalTemplate {...templateProps} />;
          default:
            return <ProfessionalTemplate {...templateProps} />;
        }
      })()}

      {/* Footer - Show for all templates except Minimal */}
      {portfolio.template !== 'minimal' && (
      <footer className="relative py-6 text-gray-400 border-t border-gray-800 z-10">
        <div className="px-6 md:px-12">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-12 mb-6">
            <div className="flex flex-col flex-1 max-w-2xl">
              <button
                onClick={scrollToTop}
                className="mb-4 hover:opacity-80 transition-opacity cursor-pointer text-left"
              >
                {portfolio.logoUrl ? (
                  <img
                    src={portfolio.logoUrl}
                    alt="Logo"
                    className="w-[120px] md:w-[140px] lg:w-[150px]"
                  />
                ) : (
                  (() => {
                    const logoText = portfolio.logoText || content.hero?.title?.split(' ')[0] || 'Logo';
                    const firstLetter = logoText[0]?.toUpperCase() || 'L';
                    const restOfWord = logoText.slice(1)?.toLowerCase() || 'ogo';
                    
                    return (
                      <svg 
                        width="150" 
                        height="48" 
                        viewBox="0 0 150 48" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[120px] md:w-[140px] lg:w-[150px]"
                      >
                        <defs>
                          <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: 'var(--theme-primary)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'var(--theme-secondary)', stopOpacity: 1 }} />
                          </linearGradient>
                          <filter id="footerGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <text 
                          x="5" 
                          y="32" 
                          fontSize="32" 
                          fontWeight="800" 
                          fill="url(#footerLogoGradient)"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          filter="url(#footerGlow)"
                          letterSpacing="-1"
                        >
                          {firstLetter}
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
                          {restOfWord}
                        </text>
                      </svg>
                    );
                  })()
                )}
              </button>
              <p className="text-base leading-relaxed text-gray-400">
                {content.hero?.description || "Let's connect and create something amazing together."}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-6 text-white">
              {content.contact?.github && (
                <a
                  href={content.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="transition-transform transform hover:scale-110 hover:text-[#c9510c] hover:drop-shadow-md"
                >
                  <Github size={28} />
                </a>
              )}
              {content.contact?.linkedin && (
                <a
                  href={content.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transition-transform transform hover:scale-110 hover:text-[#0077b5] hover:drop-shadow-md"
                >
                  <Linkedin size={28} />
                </a>
              )}
            </div>
          </div>

          <hr className="border-gray-700 mb-10" />

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Navigation Links */}
            <div className="flex gap-4 md:gap-6 text-sm flex-wrap justify-center text-gray-400">
              <button
                onClick={() => scrollToSection('about')}
                className="hover:text-gray-200 cursor-pointer transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="hover:text-gray-200 cursor-pointer transition-colors"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="hover:text-gray-200 cursor-pointer transition-colors"
              >
                Connect with me
              </button>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-500">
              Â© {new Date().getFullYear()} {content.hero?.title || 'Portfolio'}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center text-white rounded-full transition-all duration-300 shadow-lg theme-gradient ${
          showScrollTop
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90 pointer-events-none'
        } hover:scale-110`}
      >
        <ArrowUp className="text-xl" />
      </button>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'tween' }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-[#181818] rounded-2xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-3xl font-bold text-white">{selectedProject.name}</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedProject.image && (
                  <div className="mb-6 rounded-lg overflow-hidden bg-[#2a2a2a]">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-white mb-3">About This Project</h4>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                </div>

                {selectedProject.technologies && (
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-white mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-3">
                      {(Array.isArray(selectedProject.technologies)
                        ? selectedProject.technologies
                        : selectedProject.technologies.split(',').map(t => t.trim()).filter(Boolean)
                      ).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-[#2a2a2a] text-white rounded-lg text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-gray-700">
                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2e2e2e] to-[#1f1f1f] hover:from-[#3d3d3d] hover:to-[#2a2a2a] text-white rounded-lg transition-all duration-300"
                    >
                      <Code2 className="h-5 w-5" />
                      View Code
                    </a>
                  )}
                  {selectedProject.liveLink && (
                    <a
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-lg transition-all duration-300"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
