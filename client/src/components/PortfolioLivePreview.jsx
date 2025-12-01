import { useState, useMemo } from 'react';
import { Linkedin, Github, Eye } from 'lucide-react';
import ModernTemplate from './portfolio-templates/ModernTemplate';
import ProfessionalTemplate from './portfolio-templates/ProfessionalTemplate';
import CreativeTemplate from './portfolio-templates/CreativeTemplate';
import MinimalTemplate from './portfolio-templates/MinimalTemplate';
import { applyThemeVariables, getThemeColors } from '../utils/portfolioThemes';
import { getSkillIcon } from '../utils/skillIcons';

export default function PortfolioLivePreview({ data }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState('all');

  const portfolio = useMemo(() => ({
    profileImageUrl: data.profileImageUrl,
    logoUrl: data.logoUrl,
    logoText: data.logoText,
    resumeUrl: data.resumeUrl,
    colorTheme: data.colorTheme || 'purple-pink',
    template: data.template || 'professional',
    views: data.views || 0
  }), [data.profileImageUrl, data.logoUrl, data.logoText, data.resumeUrl, data.colorTheme, data.template, data.views]);

  const content = data.content || {};
  const themeColors = getThemeColors(portfolio.colorTheme);
  const uniqueId = `preview-logo-${Math.random().toString(36).substr(2, 9)}`;
  
  // Get unique tags from projects
  const projectTags = content.projects 
    ? ['all', 'recent', ...new Set(content.projects.map(p => p.tag).filter(Boolean))]
    : ['all', 'recent'];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Conditionally include nav links only if their sections have data
  const hasHeroInfo = content.hero?.title || content.hero?.subtitle || content.hero?.description;
  const hasAboutInfo = content.about && content.about.trim().length > 0;
  const hasSkillsInfo = content.skills && content.skills.length > 0;
  const hasProjectsInfo = content.projects && content.projects.length > 0;
  const hasContactInfo = content.contact?.email || content.contact?.phone || content.contact?.linkedin || content.contact?.github;
  
  const navLinks = [];
  if (hasHeroInfo) navLinks.push('home');
  if (hasAboutInfo) navLinks.push('about');
  if (hasSkillsInfo) navLinks.push('skills');
  if (hasProjectsInfo) navLinks.push('projects');
  if (hasContactInfo) navLinks.push('contact');

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

  const renderTemplate = () => {
    switch (portfolio.template) {
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'creative':
        return <CreativeTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      case 'professional':
      default:
        return <ProfessionalTemplate {...templateProps} />;
    }
  };

  return (
    <>
      <style>{`
        .preview-container {
          ${Object.entries(applyThemeVariables(portfolio.colorTheme))
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n          ')}
        }
        
        .preview-container .theme-gradient {
          background-image: linear-gradient(to right, var(--theme-primary), var(--theme-secondary));
        }
        .preview-container .theme-bg { background-color: var(--theme-background); }
        .preview-container .theme-border { border-color: var(--theme-border); }
      `}</style>
      
      <div className="preview-container text-white relative theme-bg" style={{ minHeight: 'auto', height: 'auto', display: 'block' }}>
        {/* Global Glowing Background Orbs */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-0" style={{ height: '100%' }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
          <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        </div>

        {/* Navbar */}
        <nav className="sticky top-0 left-0 right-0 backdrop-blur-sm z-50" style={{ 
          backgroundColor: portfolio.template === 'minimal' ? 'rgba(255, 255, 255, 0.9)' : 'var(--theme-background)E6', 
          borderBottom: portfolio.template === 'minimal' ? '1px solid #e5e5e5' : '1px solid var(--theme-border)' 
        }}>
          <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
            <button className="flex items-center hover:opacity-80 transition-opacity">
              {portfolio.logoUrl ? (
                <img src={portfolio.logoUrl} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
              ) : (
                (() => {
                  const logoText = portfolio.logoText || content.hero?.title?.split(' ')[0] || 'Logo';
                  const firstLetter = logoText[0]?.toUpperCase() || 'L';
                  const restOfWord = logoText.slice(1)?.toLowerCase() || 'ogo';
                  
                  return (
                    <svg width="140" height="48" viewBox="0 0 140 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 md:h-12 w-auto">
                      <defs>
                        <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: themeColors.primary, stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: themeColors.secondary, stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      <text x="5" y="32" fontSize="32" fontWeight="800" fill={`url(#${uniqueId})`} fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-1">{firstLetter}</text>
                      <text x="30" y="32" fontSize="24" fontWeight="600" fill={portfolio.template === 'minimal' ? 'black' : 'white'} fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.5">{restOfWord}</text>
                    </svg>
                  );
                })()
              )}
            </button>

            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <li key={item} className="relative">
                  <button onClick={() => scrollToSection(item)} className={`text-lg capitalize transition-colors duration-200 ${
                    portfolio.template === 'minimal'
                      ? 'text-gray-600 hover:text-gray-800'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-sm md:hidden">
              <button className={portfolio.template === 'minimal' ? 'text-black' : 'text-white'}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-sm">
              <Eye className={`w-4 h-4 ${portfolio.template === 'minimal' ? 'text-gray-700' : ''}`} style={{ color: portfolio.template === 'minimal' ? undefined : 'var(--theme-primary)' }} />
              <span className={portfolio.template === 'minimal' ? 'text-gray-700' : 'text-gray-400'}>{portfolio.views}</span>
            </div>
          </div>
        </nav>

        {renderTemplate()}

        {/* Footer */}
        {portfolio.template !== 'minimal' && (
          <footer className="relative py-6 text-gray-400 border-t border-gray-800 z-10">
            <div className="px-6 md:px-12">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="text-sm text-gray-500 text-center lg:text-left">
                  © {new Date().getFullYear()} {content.hero?.title || 'Portfolio'}. All rights reserved.
                </div>
                <div className="flex gap-4">
                  {content.contact?.github && (
                    <a href={content.contact.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                      <Github size={24} />
                    </a>
                  )}
                  {content.contact?.linkedin && (
                    <a href={content.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                      <Linkedin size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
