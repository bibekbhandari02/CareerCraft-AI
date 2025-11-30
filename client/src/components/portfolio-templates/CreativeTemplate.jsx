import { Mail, Linkedin, Github, Sparkles, Zap, Star, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSkillIcon } from '../../utils/skillIcons';

export default function CreativeTemplate({ portfolio, content, scrollToSection, projectFilter, setProjectFilter, projectTags, setSelectedProject, setIsModalOpen }) {
  return (
    <>
      {/* HERO - High Visual Impact, Animated */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-16 z-10 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-10 right-10 w-96 h-96 theme-gradient rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-10 left-10 w-[32rem] h-[32rem] theme-gradient rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] theme-gradient rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Image (Creative: Image First!) */}
            {portfolio.profileImageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 flex justify-center relative"
              >
                <div className="relative">
                  {/* Multiple Glow Layers */}
                  <div className="absolute -inset-6 theme-gradient rounded-[3rem] blur-3xl opacity-50 animate-pulse"></div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 theme-gradient rounded-3xl opacity-60 blur-2xl"></div>
                  <div className="absolute -top-10 -left-10 w-48 h-48 theme-gradient rounded-3xl opacity-60 blur-2xl"></div>

                  {/* Image */}
                  <img
                    src={portfolio.profileImageUrl}
                    alt={content.hero?.title}
                    className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-cover rounded-[3rem] shadow-2xl border-4 border-white/20 transform hover:rotate-2 transition-transform duration-300"
                  />

                  {/* Decorative Stars */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-4 -right-4"
                  >
                    <Star size={32} className="text-yellow-400 fill-yellow-400" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-6 -left-6"
                  >
                    <Sparkles size={28} className="text-purple-400" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 text-center lg:text-left"
            >
              {/* Creative Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-500/50 rounded-full backdrop-blur-sm"
              >
                <Sparkles size={20} className="text-purple-400 animate-pulse" />
                <span className="text-transparent bg-clip-text theme-gradient font-bold text-base sm:text-lg">
                  {content.hero?.subtitle || 'Creative Professional'}
                </span>
              </motion.div>

              {/* Big Punchy Headline with Rotation */}
              <motion.h1
                initial={{ opacity: 0, y: 20, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 leading-none"
              >
                <motion.span 
                  className="text-white block mb-2"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(168, 85, 247, 0.4)",
                      "0 0 40px rgba(236, 72, 153, 0.4)",
                      "0 0 20px rgba(168, 85, 247, 0.4)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {content.hero?.title?.split(' ')[0]}
                </motion.span>
                <motion.span 
                  className="text-transparent bg-clip-text theme-gradient block"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  {content.hero?.title?.split(' ').slice(1).join(' ')}
                </motion.span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-base sm:text-lg md:text-xl lg:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
              >
                {content.hero?.description}
              </motion.p>

              {/* Creative CTAs */}
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
                    className="group px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-white font-bold text-sm sm:text-base lg:text-lg shadow-2xl transition-all hover:scale-105 theme-gradient relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Sparkles size={20} className="group-hover:animate-pulse" />
                      Grab My Resume
                    </span>
                  </a>
                )}
                {content.contact?.email && (
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="group px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-white/10 backdrop-blur-sm text-white font-bold text-sm sm:text-base lg:text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Zap size={20} className="group-hover:rotate-12 transition-transform" />
                      Let's Create Together
                    </span>
                  </button>
                )}
              </motion.div>

              {/* Social Icons - Creative Style */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex gap-5 mt-10 justify-center lg:justify-start"
              >
                {content.contact?.github && (
                  <a
                    href={content.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all"
                  >
                    <Github size={24} className="text-white" />
                  </a>
                )}
                {content.contact?.linkedin && (
                  <a
                    href={content.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all"
                  >
                    <Linkedin size={24} className="text-white" />
                  </a>
                )}
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ABOUT - Tilted Card Design */}
      {content.about && (
        <section id="about" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 z-10">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative"
            >
              {/* Decorative Background */}
              <div className="absolute -inset-4 theme-gradient rounded-[2rem] blur-3xl opacity-20"></div>

              {/* Heading - Same style as other sections */}
              <motion.div 
                className="flex items-center gap-3 mb-12"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-16 h-1 theme-gradient rounded-full"
                  animate={{ scaleX: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white">
                  About Me 👋
                </h2>
              </motion.div>

              {/* Content Card - Slightly Tilted */}
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-white/10 rounded-[2rem] p-8 sm:p-12 lg:p-16 transform hover:rotate-1 transition-transform duration-300">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed font-light text-center md:text-left">
                  {content.about}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SKILLS - Animated Skill Bubbles */}
      {content.skills && content.skills.length > 0 && (
        <section id="skills" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 z-10">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="flex items-center gap-3 mb-16"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-16 h-1 theme-gradient rounded-full"
                animate={{ scaleX: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white">
                My Superpowers ⚡
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {content.skills.map((skillGroup, index) => {
                const skillItems = Array.isArray(skillGroup.items)
                  ? skillGroup.items
                  : skillGroup.items.split(',').map(s => s.trim()).filter(Boolean);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, rotate: -2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Hover Glow */}
                    <div className="absolute -inset-1 theme-gradient rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>

                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-white/20 transition-all">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-6">{skillGroup.category}</h3>
                      <div className="flex flex-wrap gap-3">
                        {skillItems.map((skill, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 hover:scale-105 transition-all"
                          >
                            {getSkillIcon(skill, 'text-base')}
                            <span>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS - Masonry Grid / Interactive */}
      {content.projects && content.projects.length > 0 && (
        <section id="projects" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 z-10">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="flex items-center gap-3 mb-12"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-16 h-1 theme-gradient rounded-full"
                animate={{ scaleX: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white">
                Featured Work 🎨
              </h2>
            </motion.div>

            {/* Filter Tags */}
            <div className="flex gap-4 mb-16 flex-wrap">
              {projectTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setProjectFilter(tag)}
                  className={`px-6 sm:px-8 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all ${
                    projectFilter === tag
                      ? 'theme-gradient text-white shadow-lg scale-105'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Project Grid - Staggered Layout */}
            <div className="space-y-12 sm:space-y-16">
              {(projectFilter === 'all'
                ? content.projects
                : projectFilter === 'recent'
                ? content.projects.slice(0, 3)
                : content.projects.filter(p => p.tag === projectFilter)
              ).map((project, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsModalOpen(true);
                    }}
                    className="relative group cursor-pointer"
                  >
                    {/* Hover Glow */}
                    <div className="absolute -inset-2 theme-gradient rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity"></div>

                    {/* Card - Alternating Layout */}
                    <div className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-white/10 rounded-3xl overflow-hidden group-hover:border-white/30 transition-all ${
                      isEven ? 'lg:mr-20' : 'lg:ml-20'
                    }`}>
                      <div className={`grid ${project.image ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-0`}>
                        {/* Image */}
                        {project.image && (
                          <div className={`h-64 sm:h-80 lg:h-96 overflow-hidden ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                            <img
                              src={project.image}
                              alt={project.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}

                        {/* Info */}
                        <div className={`p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black text-white mb-4 sm:mb-6 text-center lg:text-left">{project.name}</h3>
                          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed text-center lg:text-left">
                            {project.description}
                          </p>

                          {/* Tech Tags */}
                          {project.technologies && (
                            <div className="flex flex-wrap gap-3">
                              {(Array.isArray(project.technologies)
                                ? project.technologies
                                : project.technologies.split(',').map(t => t.trim())
                              )
                                .slice(0, 5)
                                .map((tech, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:bg-white/10 transition-colors"
                                  >
                                    {getSkillIcon(tech, 'text-base')}
                                    <span>{tech}</span>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT - Artistic Form */}
      <section id="contact" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 z-10">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="flex items-center gap-3 mb-16"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="w-16 h-1 theme-gradient rounded-full"
              animate={{ scaleX: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white">
              Let's Talk 💬
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Background Glow */}
            <div className="absolute -inset-2 theme-gradient rounded-3xl blur-2xl opacity-20"></div>

            {/* Form Card */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-white/10 rounded-3xl p-8 sm:p-12">
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
                  className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all text-sm sm:text-base md:text-lg"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all text-sm sm:text-base"
                />
                <textarea
                  name="message"
                  required
                  rows="5"
                  placeholder="Your Message"
                  className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 resize-none transition-all text-sm sm:text-base"
                ></textarea>
                <button
                  type="submit"
                  className="w-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 theme-gradient rounded-2xl text-white font-bold text-sm sm:text-base md:text-lg hover:scale-105 transition-all shadow-2xl"
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
