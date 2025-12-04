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
    setIsModalOpen,
    isPreview: true // Flag to indicate this is a preview context
  };

  // Render the selected template
  const renderTemplate = () => {
    const currentTemplate = portfolio.template || 'professional';
    
    switch (currentTemplate) {
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      case 'creative':
        return <CreativeTemplate {...templateProps} />;
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
      
      <div className="preview-container text-white theme-bg" style={{ minHeight: '100vh', height: 'auto', display: 'block', position: 'relative' }}>
        {renderTemplate()}
      </div>
    </>
  );
}
