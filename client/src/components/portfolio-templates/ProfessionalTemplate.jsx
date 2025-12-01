import { Mail, Phone, Linkedin, Github, Code2, ExternalLink, ArrowUp, FolderGit2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfessionalTemplate({ portfolio, content, scrollToSection, getSkillIcon, projectFilter, setProjectFilter, projectTags, setSelectedProject, setIsModalOpen }) {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-40 xl:pt-44 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">
            {/* Profile Picture */}
            {portfolio.profileImageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-4 flex justify-center lg:justify-end order-first lg:order-last"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl opacity-20 theme-gradient"></div>
                  <img
                    src={portfolio.profileImageUrl}
                    alt={content.hero?.title}
                    loading="eager"
                    decoding="async"
                    className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-cover rounded-full shadow-2xl"
                  />
                </div>
              </motion.div>
            )}

            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className={`${portfolio.profileImageUrl ? 'lg:col-span-8' : 'lg:col-span-12'} text-center ${portfolio.profileImageUrl ? 'lg:text-left' : ''}`}
            >
              {content.hero?.subtitle && (
                <div className="inline-block mb-3 sm:mb-4 md:mb-5 backdrop-blur-md bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full text-gray-300">
                  {content.hero.subtitle}
                </div>
              )}
              
              {content.hero?.title && (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-5 md:mb-6 leading-tight">
                  <span className="text-transparent bg-clip-text theme-gradient">
                    {content.hero.title}
                  </span>
                </h1>
              )}
              
              {content.hero?.description && (
                <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-7 md:mb-8 leading-relaxed text-center lg:text-justify max-w-3xl mx-auto lg:mx-0">
                  {content.hero.description}
                </p>
              )}

              <div className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 ${portfolio.profileImageUrl ? 'justify-center lg:justify-start' : 'justify-center'}`}>
                {content.contact?.email && (
                  <button
                    onClick={() => {
                      scrollToSection('contact');
                      setTimeout(() => {
                        document.getElementById('name')?.focus();
                      }, 500);
                    }}
                    className="px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    Connect With Me
                  </button>
                )}
                {portfolio.resumeUrl ? (
                  <motion.a
                    href={portfolio.resumeUrl}
                    download={`${content.hero?.title?.replace(/\s+/g, '_')}_CV.pdf`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 theme-gradient theme-gradient-hover text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download CV
                  </motion.a>
                ) : content.contact?.github ? (
                  <a
                    href={content.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 theme-gradient theme-gradient-hover text-sm sm:text-base"
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                    View GitHub
                  </a>
                ) : null}
              </div>

              <div className={`flex gap-3 sm:gap-4 mt-6 sm:mt-7 md:mt-8 ${portfolio.profileImageUrl ? 'justify-center lg:justify-start' : 'justify-center'}`}>
                {content.contact?.github && (
                  <a
                    href={content.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#c9510c] text-white transition-all duration-300 hover:scale-110"
                  >
                    <Github className="w-6 h-6 sm:w-7 sm:h-7" />
                  </a>
                )}
                {content.contact?.linkedin && (
                  <a
                    href={content.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0077b5] text-white transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-6 h-6 sm:w-7 sm:h-7" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {content.about && (
        <section id="about" className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 z-10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-left md:text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">About Me</h2>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed whitespace-pre-line text-center md:text-justify">
                  {content.about}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {content.skills && content.skills.length > 0 && (
        <section id="skills" className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 z-10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-left md:text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Skills & Tools</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
                {content.skills.map((skillGroup, index) => {
                  let skillItems = [];
                  if (Array.isArray(skillGroup.items)) {
                    skillItems = skillGroup.items;
                  } else if (typeof skillGroup.items === 'string') {
                    skillItems = skillGroup.items.split(',').map(s => s.trim()).filter(Boolean);
                  }

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 p-5 sm:p-6 md:p-7 rounded-2xl hover:bg-white/10 transition-all"
                    >
                      <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 text-white">
                        {skillGroup.category}
                      </h4>
                      <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3">
                        {skillItems.map((skill, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:scale-105 transition-all duration-200"
                          >
                            {getSkillIcon(skill)}
                            <span>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {content.projects && content.projects.length > 0 && (
        <section id="projects" className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 z-10">
          <div className="container mx-auto max-w-7xl">
            <div className="text-left md:text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6">My Projects</h2>
              
              {/* Filter Tags */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {projectTags.map((tag) => {
                  const tagLabels = {
                    'all': 'All',
                    'recent': 'Recent',
                    'ai': 'AI',
                    'fullstack': 'Full Stack',
                    'frontend': 'Frontend',
                    'web': 'Web'
                  };
                  
                  return (
                    <button
                      key={tag}
                      onClick={() => setProjectFilter(tag)}
                      className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-300 ${
                        projectFilter === tag
                          ? 'text-white theme-gradient shadow-lg'
                          : 'text-gray-400 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:text-gray-300'
                      }`}
                    >
                      {tagLabels[tag] || tag}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
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
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsModalOpen(true);
                  }}
                  className="rounded-xl overflow-hidden shadow-lg flex flex-col backdrop-blur-xl bg-white/5 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 cursor-pointer"
                >
                  <div className="h-56 w-full relative group overflow-hidden bg-gray-900/50">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center text-6xl">
                        {index % 3 === 0 ? '🚀' : index % 3 === 1 ? '💡' : '🎨'}
                      </div>
                    )}
                    
                    <div className="overlay items-center justify-center absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-black/0 hidden group-hover:flex group-hover:bg-black/80 transition-all duration-500 gap-4">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="h-14 w-14 border-2 rounded-full border-[#ADB7BE] hover:border-white flex items-center justify-center group/link"
                        >
                          <Code2 className="h-8 w-8 text-[#ADB7BE] group-hover/link:text-white" />
                        </a>
                      )}
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="h-14 w-14 border-2 rounded-full border-[#ADB7BE] hover:border-white flex items-center justify-center group/link"
                        >
                          <ExternalLink className="h-8 w-8 text-[#ADB7BE] group-hover/link:text-white" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-white py-5 sm:py-6 px-4 sm:px-5 flex flex-col gap-2.5 sm:gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xl sm:text-2xl md:text-3xl font-semibold flex-1">{project.name}</h5>
                      {project.tag && (
                        <span className="px-2 py-1 text-sm sm:text-base font-medium rounded-full theme-gradient flex-shrink-0">
                          {project.tag === 'ai' ? 'AI' : 
                           project.tag === 'fullstack' ? 'Full Stack' : 
                           project.tag === 'frontend' ? 'Frontend' : 
                           project.tag === 'web' ? 'Web' : project.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-base sm:text-lg text-gray-300 line-clamp-2">{project.description}</p>
                    
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                        {(Array.isArray(project.technologies)
                          ? project.technologies
                          : project.technologies.split(',').map(t => t.trim()).filter(Boolean)
                        ).map((tech, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-sm sm:text-base text-gray-300 backdrop-blur-md bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors"
                          >
                            {getSkillIcon(tech, 'text-sm sm:text-base')}
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

      {/* Contact Section */}
      {(content.contact?.email || content.contact?.phone || content.contact?.linkedin || content.contact?.github) && (
      <section id="contact" className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="hidden md:block text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Get in touch
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 sm:gap-12 md:gap-16">
            {/* Info Section */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6">Let's Connect</h2>
              <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-7 md:mb-8">
                I'm always excited to work on new projects and collaborate with passionate people. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>

              <ul className="space-y-3 sm:space-y-4 text-white text-base sm:text-lg">
                {content.contact?.email && (
                  <li className="flex items-center gap-3 sm:gap-4">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="break-all">{content.contact.email}</span>
                  </li>
                )}
                {content.contact?.phone && (
                  <li className="flex items-center gap-3 sm:gap-4">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span>{content.contact.phone}</span>
                  </li>
                )}
              </ul>

              <div className="flex gap-3 sm:gap-4 mt-5 sm:mt-6">
                {content.contact?.github && (
                  <a
                    href={content.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-white transition-transform transform hover:scale-110 hover:text-[#c9510c] hover:drop-shadow-md"
                  >
                    <Github className="w-6 h-6 sm:w-7 sm:h-7" />
                  </a>
                )}
                {content.contact?.linkedin && (
                  <a
                    href={content.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-white transition-transform transform hover:scale-110 hover:text-[#0077b5] hover:drop-shadow-md"
                  >
                    <Linkedin className="w-6 h-6 sm:w-7 sm:h-7" />
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form */}
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
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                  });

                  const result = await response.json();
                  if (result.success) {
                    alert('Message sent successfully! I\'ll get back to you soon.');
                    e.target.reset();
                  } else {
                    alert('Submission failed. Please try again!');
                  }
                } catch (error) {
                  alert('An error occurred. Please check your connection.');
                }
              }}
              className="flex-1 space-y-5 sm:space-y-6 w-full"
            >
              <div>
                <label htmlFor="name" className="block text-sm sm:text-base text-white mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Enter your name"
                  className="backdrop-blur-md bg-white/5 border border-white/20 placeholder-gray-400 text-white text-base sm:text-lg rounded-lg block w-full p-3 sm:p-4 focus:ring-2 focus:border-white/40 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm sm:text-base text-white mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Enter your email"
                  className="backdrop-blur-md bg-white/5 border border-white/20 placeholder-gray-400 text-white text-base sm:text-lg rounded-lg block w-full p-3 sm:p-4 focus:ring-2 focus:border-white/40 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm sm:text-base text-white mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  required
                  placeholder="Enter your message"
                  className="backdrop-blur-md bg-white/5 border border-white/20 placeholder-gray-400 text-white text-base sm:text-lg rounded-lg block w-full p-3 sm:p-4 focus:ring-2 focus:border-white/40 focus:outline-none resize-none transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 theme-gradient theme-gradient-hover text-sm sm:text-base w-full sm:w-auto"
              >
                Send Message
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
