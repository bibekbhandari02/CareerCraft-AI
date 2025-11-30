import { Mail, Linkedin, Github, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSkillIcon } from '../../utils/skillIcons';

export default function MinimalTemplate({ portfolio, content, scrollToSection, projectFilter, setProjectFilter, projectTags, setSelectedProject, setIsModalOpen }) {
  return (
    <>
      {/* HERO - Text-Centric, Lots of Whitespace */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-20 z-10 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Giant Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-8 text-black tracking-tight leading-tight">
              {content.hero?.title || 'Your Name'}
            </h1>

            {/* One-Sentence Description */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 font-light">
              {content.hero?.subtitle || 'Full Stack Developer'}
            </p>

            {/* Thin Divider with animation */}
            <motion.div 
              className="w-16 h-px bg-gray-400 mx-auto my-12"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            ></motion.div>

            {/* Brief Description */}
            <p className="text-base sm:text-lg text-gray-500 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
              {content.hero?.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {portfolio.resumeUrl && (
                <motion.a
                  href={portfolio.resumeUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-all font-light shadow-sm hover:shadow-md"
                >
                  <Download size={16} />
                  Download CV
                </motion.a>
              )}
              {content.contact?.email && (
                <motion.button
                  onClick={() => scrollToSection('contact')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-8 py-3 border-2 border-gray-400 text-gray-800 text-sm uppercase tracking-wider hover:bg-black hover:text-white hover:border-black transition-all font-light"
                >
                  Contact Me
                </motion.button>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex gap-8 justify-center mt-16">
              {content.contact?.github && (
                <motion.a
                  href={content.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  <Github size={24} />
                </motion.a>
              )}
              {content.contact?.linkedin && (
                <motion.a
                  href={content.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  <Linkedin size={24} />
                </motion.a>
              )}
              {content.contact?.email && (
                <a href={`mailto:${content.contact.email}`} className="text-gray-400 hover:text-black transition-colors">
                  <Mail size={24} />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT - Simple Text Block */}
      {content.about && (
        <section id="about" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12 z-10 bg-white border-t border-gray-200">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm sm:text-base uppercase tracking-widest text-gray-600 mb-12 text-center font-medium">
                About
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed text-center font-light">
                {content.about}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* SKILLS - Simple List */}
      {content.skills && content.skills.length > 0 && (
        <section id="skills" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12 z-10 bg-white border-t border-gray-200">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-sm sm:text-base uppercase tracking-widest text-gray-600 mb-16 text-center font-medium">
              Skills
            </h2>

            <div className="space-y-16">
              {content.skills.map((skillGroup, index) => {
                const skillItems = Array.isArray(skillGroup.items)
                  ? skillGroup.items
                  : skillGroup.items.split(',').map(s => s.trim()).filter(Boolean);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <h3 className="text-base sm:text-lg text-gray-600 mb-6 font-light">{skillGroup.category}</h3>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                      {skillItems.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-400 transition-colors">
                          {getSkillIcon(skill, 'text-lg')}
                          <span className="text-sm sm:text-base text-black font-light">{skill}</span>
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

      {/* PROJECTS - Simple List/Grid */}
      {content.projects && content.projects.length > 0 && (
        <section id="projects" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12 z-10 bg-white border-t border-gray-200">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-sm sm:text-base uppercase tracking-widest text-gray-600 mb-16 text-center font-medium">
              Selected Work
            </h2>

            {/* Filter Tags */}
            <div className="flex justify-center gap-6 sm:gap-8 mb-20 flex-wrap">
              {projectTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setProjectFilter(tag)}
                  className={`text-xs sm:text-sm uppercase tracking-wide transition-colors font-light ${
                    projectFilter === tag
                      ? 'text-black border-b border-black pb-1'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Project List */}
            <div className="space-y-20 sm:space-y-24">
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
                  onClick={() => {
                    setSelectedProject(project);
                    setIsModalOpen(true);
                  }}
                  className="border-b border-gray-200 pb-20 cursor-pointer group"
                >
                  <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                    {/* Project Image */}
                    {project.image && (
                      <div className="overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-64 sm:h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                    )}

                    {/* Project Info */}
                    <div className={project.image ? '' : 'md:col-span-2 text-center'}>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-6">
                        {project.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed font-light">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                          {(Array.isArray(project.technologies)
                            ? project.technologies
                            : project.technologies.split(',').map(t => t.trim())
                          ).map((tech, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 hover:border-gray-400 transition-colors">
                              {getSkillIcon(tech, 'text-base')}
                              <span className="text-xs sm:text-sm text-gray-600 font-light">{tech}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT - Simple Form */}
      <section id="contact" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12 z-10 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-sm sm:text-base uppercase tracking-widest text-gray-600 mb-16 text-center font-medium">
            Get In Touch
          </h2>

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
            className="space-y-10"
          >
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="Name"
              className="w-full px-0 py-4 bg-transparent border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-gray-600 font-light text-base sm:text-lg"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="w-full px-0 py-4 bg-transparent border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-gray-600 font-light text-base sm:text-lg"
            />
            <textarea
              name="message"
              required
              rows="4"
              placeholder="Message"
              className="w-full px-0 py-4 bg-transparent border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-gray-600 resize-none font-light text-base sm:text-lg"
            ></textarea>

            <div className="text-center pt-8">
              <button
                type="submit"
                className="px-12 py-3 border border-gray-400 text-gray-800 text-sm uppercase tracking-wider hover:bg-black hover:text-white hover:border-black transition-all font-light"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER - Simple Minimal */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-12 z-10 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm text-gray-500 font-light">
              © {new Date().getFullYear()} {content.hero?.title || 'Portfolio'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
