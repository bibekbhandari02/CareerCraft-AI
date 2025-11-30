import { Linkedin, Github, ExternalLink, Code2, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSkillIcon } from '../../utils/skillIcons';

export default function ModernTemplate({ portfolio, content, scrollToSection, projectFilter, setProjectFilter, projectTags, setSelectedProject, setIsModalOpen }) {
  return (
    <>
      {/* HERO - Full Screen, Big Typography, Bold */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-16 z-10 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-20 right-10 w-72 h-72 theme-gradient rounded-full blur-3xl opacity-20"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-20 left-10 w-96 h-96 theme-gradient rounded-full blur-3xl opacity-10"
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-full"
              >
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-sm font-medium text-gray-300">{content.hero?.subtitle || 'Full Stack Developer'}</span>
              </motion.div>

              {/* Big Heading with Gradient */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black mb-6 leading-tight"
              >
                <span className="block text-white">Hi, I'm</span>
                <span className="block text-transparent bg-clip-text theme-gradient">
                  {content.hero?.title || 'Your Name'}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-center lg:text-left"
              >
                {content.hero?.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {portfolio.resumeUrl && (
                  <a
                    href={portfolio.resumeUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-6 sm:px-8 py-3 sm:py-4 theme-gradient rounded-xl text-white font-bold text-sm sm:text-base lg:text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download CV
                  </a>
                )}
                
                {content.contact?.email && (
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-bold text-sm sm:text-base lg:text-lg transition-all hover:scale-105"
                  >
                    Contact Me
                  </button>
                )}
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex gap-4 mt-8 justify-center lg:justify-start"
              >
                {content.contact?.github && (
                  <a
                    href={content.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Github size={20} className="text-white" />
                  </a>
                )}
                {content.contact?.linkedin && (
                  <a
                    href={content.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Linkedin size={20} className="text-white" />
                  </a>
                )}
              </motion.div>
            </motion.div>

            {/* Right - Image/Illustration */}
            {portfolio.profileImageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center order-1 lg:order-2"
              >
                <div className="relative">
                  {/* Glow Effect - Behind image */}
                  <div className="absolute inset-0 theme-gradient rounded-3xl blur-3xl opacity-40 animate-pulse -z-10"></div>
                  
                  {/* Image */}
                  <img
                    src={portfolio.profileImageUrl}
                    alt={content.hero?.title}
                    className="relative z-10 w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-cover rounded-3xl shadow-2xl"
                  />
                  
                  {/* Decorative Elements - Behind image */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 theme-gradient rounded-2xl opacity-60 blur-xl -z-10"></div>
                  <div className="absolute -top-4 -left-4 w-24 h-24 theme-gradient rounded-2xl opacity-60 blur-xl -z-10"></div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT - 1 or 2 Columns */}
      {content.about && (
        <section id="about" className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 z-10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 text-center">About Me</h2>
              
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-12">
                <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
                  {content.about}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SKILLS - Bento Grid Layout */}
      {content.skills && content.skills.length > 0 && (
        <section id="skills" className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 z-10">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 text-center">Skills & Expertise</h2>
            
            {/* Bento Grid - Varied sizes for visual interest */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 auto-rows-fr">
              {content.skills.map((skillGroup, index) => {
                const skillItems = Array.isArray(skillGroup.items)
                  ? skillGroup.items
                  : skillGroup.items.split(',').map(s => s.trim()).filter(Boolean);

                // Bento grid pattern: vary the column spans for visual interest on all screens
                const getGridSpan = (idx) => {
                  const patterns = [
                    'col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3', // Large
                    'col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2', // Medium
                    'col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2', // Medium
                    'col-span-2 sm:col-span-3 md:col-span-2 lg:col-span-3', // Large
                    'col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2', // Medium
                    'col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-4', // Extra Large
                  ];
                  return patterns[idx % patterns.length];
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`${getGridSpan(index)} backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 hover:scale-[1.02] transition-all group relative overflow-hidden`}
                    style={{
                      '--hover-gradient': 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))'
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 theme-gradient"></div>
                    
                    {/* Border gradient on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" 
                         style={{
                           background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                           padding: '1px',
                           WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                           WebkitMaskComposite: 'xor',
                           maskComposite: 'exclude'
                         }}>
                    </div>
                    
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 transition-all relative z-10">
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {skillItems.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-xs text-white hover:bg-white/20 hover:scale-105 transition-all"
                        >
                          {getSkillIcon(skill, 'text-xs sm:text-sm')}
                          <span className="text-xs sm:text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS - 2-Column Grid with Cards */}
      {content.projects && content.projects.length > 0 && (
        <section id="projects" className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 z-10">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 text-center">Featured Projects</h2>
            
            {/* Filter Tags */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 flex-wrap px-4">
              {projectTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setProjectFilter(tag)}
                  className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-all ${
                    projectFilter === tag
                      ? 'theme-gradient text-white shadow-lg scale-105'
                      : 'backdrop-blur-md bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>

            {/* Project Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(projectFilter === 'all'
                ? content.projects
                : projectFilter === 'recent'
                ? content.projects.slice(0, 3)
                : content.projects.filter(p => p.tag === projectFilter)
              ).map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsModalOpen(true);
                  }}
                  className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all cursor-pointer relative"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 theme-gradient pointer-events-none z-10"></div>
                  
                  {/* Border gradient on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none z-10" 
                       style={{
                         background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                         padding: '1px',
                         WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                         WebkitMaskComposite: 'xor',
                         maskComposite: 'exclude'
                       }}>
                  </div>
                  
                  {/* Project Image */}
                  {project.image && (
                    <div className="h-48 sm:h-56 overflow-hidden bg-gray-800">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-1">{project.name}</h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-4 line-clamp-2">{project.description}</p>

                    {/* Tech Tags */}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(project.technologies)
                          ? project.technologies
                          : project.technologies.split(',').map(t => t.trim())
                        )
                          .slice(0, 3)
                          .map((tech, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 px-3 py-1 backdrop-blur-md bg-white/10 rounded-full text-xs text-gray-300 hover:bg-white/20 transition-colors"
                            >
                              {getSkillIcon(tech, 'text-sm')}
                              <span>{tech}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT - Centered Form */}
      <section id="contact" className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 z-10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 text-center">Let's Work Together</h2>
            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-12 text-center max-w-2xl mx-auto">
              Have a project in mind? Let's create something amazing together.
            </p>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-12">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    access_key: '0d0817fe-fb5a-462a-922d-049db623bdd0'
                  };
                  try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                      body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (result.success) {
                      alert('Message sent successfully!');
                      e.target.reset();
                    }
                  } catch (error) {
                    alert('An error occurred. Please try again.');
                  }
                }}
                className="space-y-6"
              >
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Your Name"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all text-sm sm:text-base"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all text-sm sm:text-base"
                />
                <textarea
                  name="message"
                  required
                  rows="5"
                  placeholder="Your Message"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 resize-none transition-all text-sm sm:text-base"
                ></textarea>
                <button
                  type="submit"
                  className="w-full px-6 sm:px-8 py-3 sm:py-4 theme-gradient rounded-xl text-white font-bold text-base sm:text-lg hover:scale-105 transition-all shadow-2xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
