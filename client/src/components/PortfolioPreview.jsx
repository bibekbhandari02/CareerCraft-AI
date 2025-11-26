import { Mail, Github, Linkedin } from 'lucide-react';
import { getThemeColors, applyThemeVariables } from '../utils/portfolioThemes';

export default function PortfolioPreview({ data }) {
  const { content, profileImageUrl, logoUrl, logoText, colorTheme } = data;
  const themeColors = getThemeColors(colorTheme || 'purple-pink');

  if (!content) return null;
  
  const displayLogoText = logoText || content.hero?.title?.split(' ')[0] || 'Logo';
  const firstLetter = displayLogoText[0]?.toUpperCase() || 'L';
  const restOfWord = displayLogoText.slice(1)?.toLowerCase() || 'ogo';

  return (
    <div 
      className="border rounded-lg overflow-hidden shadow-2xl w-full max-w-md mx-auto lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl overflow-y-auto relative"
      style={{
        ...applyThemeVariables(colorTheme || 'purple-pink'),
        backgroundColor: 'var(--theme-background)',
        borderColor: 'var(--theme-border)',
        maxHeight: '600px'
      }}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute top-1/4 left-0 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
      </div>

      {/* Mini Navbar */}
      <div className="backdrop-blur-sm px-4 py-3 flex items-center justify-between relative z-10" style={{ backgroundColor: 'var(--theme-background)F2', borderBottom: '1px solid var(--theme-border)' }}>
        <div className="text-white text-sm font-bold">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-6 w-auto" />
          ) : (
            <svg 
              width="90" 
              height="32" 
              viewBox="0 0 90 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-auto"
            >
              <defs>
                <linearGradient id="previewLogoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'var(--theme-primary)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--theme-secondary)', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="previewGlow">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <text 
                x="3" 
                y="22" 
                fontSize="22" 
                fontWeight="800" 
                fill="url(#previewLogoGradient)"
                fontFamily="system-ui, -apple-system, sans-serif"
                filter="url(#previewGlow)"
                letterSpacing="-0.5"
              >
                {firstLetter}
              </text>
              <text 
                x="20" 
                y="22" 
                fontSize="16" 
                fontWeight="600" 
                fill="white" 
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.3"
              >
                {restOfWord}
              </text>
            </svg>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>123</span>
          </div>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative p-6 overflow-hidden z-10">
        <div className={`flex ${profileImageUrl ? 'items-center gap-4' : 'flex-col items-center text-center'}`}>
          {profileImageUrl && (
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-20"></div>
              <img
                src={profileImageUrl}
                alt="Profile"
                className="relative w-16 h-16 rounded-full border-2 border-[#1f1f1f] object-cover"
              />
            </div>
          )}
          <div className={profileImageUrl ? 'text-left' : 'text-center w-full'}>
            <div className="inline-block mb-1 bg-[#1E1E1E] px-2 py-1 text-xs rounded-full text-gray-400">
              {content.hero?.subtitle || 'Portfolio'}
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">
              {content.hero?.title || 'Your Name'}
            </h1>
            {content.hero?.description && (
              <p className="text-xs text-[#A0A0A0] mt-1 line-clamp-2">{content.hero?.description}</p>
            )}
            <div className={`flex gap-2 mt-2 ${profileImageUrl ? '' : 'justify-center'}`}>
              {content.contact?.github && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <Github className="w-4 h-4 text-white" />
                </div>
              )}
              {content.contact?.linkedin && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <Linkedin className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      {content.about && (
        <div className="px-6 py-4 border-t border-gray-800 relative z-10">
          <h2 className="text-sm font-bold mb-3 text-white text-center">About Me</h2>
          <p className="text-xs text-[#ADB7BE] leading-relaxed line-clamp-3 text-justify">
            {content.about}
          </p>
        </div>
      )}

      {/* Skills Section */}
      {content.skills && content.skills.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-800 relative z-10">
          <h2 className="text-sm font-bold mb-3 text-white text-center">Skills & Tools</h2>
          <div className="space-y-2">
            {content.skills.slice(0, 2).map((skillGroup, index) => {
              let skillItems = [];
              if (Array.isArray(skillGroup.items)) {
                skillItems = skillGroup.items;
              } else if (typeof skillGroup.items === 'string') {
                skillItems = skillGroup.items.split(',').map(s => s.trim()).filter(Boolean);
              }
              
              return (
                <div key={index} className="bg-[#1f1f1f] p-2 rounded-lg border border-gray-800">
                  <p className="text-xs font-semibold text-gray-300 mb-1">{skillGroup.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {skillItems.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs rounded bg-[#2a2a2a] text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {content.projects && content.projects.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-800 relative z-10">
          <h2 className="text-sm font-bold mb-3 text-white text-center">My Projects</h2>
          <div className="space-y-2">
            {content.projects.slice(0, 2).map((project, index) => (
              <div key={index} className="bg-[#181818] rounded-lg border border-gray-800 overflow-hidden">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-20 object-cover"
                  />
                )}
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-white mb-1">{project.name}</h3>
                  <p className="text-xs text-[#ADB7BE] line-clamp-1">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="px-6 py-4 border-t border-gray-800 bg-[#0F0F0F] relative z-10">
        <h2 className="text-sm font-bold mb-3 text-white text-center">Get in touch</h2>
        
        <div className="space-y-2 mb-3">
          {content.contact?.email && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Mail className="w-3 h-3" />
              <span className="truncate">{content.contact.email}</span>
            </div>
          )}
          {content.contact?.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{content.contact.phone}</span>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {content.contact?.github && (
            <div className="w-6 h-6 rounded-full bg-[#1f1f1f] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors">
              <Github className="w-3 h-3 text-gray-400" />
            </div>
          )}
          {content.contact?.linkedin && (
            <div className="w-6 h-6 rounded-full bg-[#1f1f1f] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors">
              <Linkedin className="w-3 h-3 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
