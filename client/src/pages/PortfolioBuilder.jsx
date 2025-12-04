import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Sparkles, Eye, Save, ArrowLeft, Plus, Trash2, Upload, Globe, ExternalLink } from 'lucide-react';
import api, { trackEvent } from '../lib/api';
import PortfolioPreview from '../components/PortfolioPreview';
import PortfolioLivePreview from '../components/PortfolioLivePreview';
import { portfolioTemplates } from '../utils/portfolioTemplates';

export default function PortfolioBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingProjectImage, setUploadingProjectImage] = useState({});
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [portfolioViews, setPortfolioViews] = useState(0);
  const { register, handleSubmit, setValue, watch, control } = useForm({
    defaultValues: {
      subdomain: '',
      theme: 'modern',
      template: 'professional',
      colorTheme: 'purple-pink',
      colors: {
        primary: '#3b82f6',
        secondary: '#1e293b',
        accent: '#f59e0b'
      },
      content: {
        hero: {
          title: '',
          subtitle: '',
          description: '',
          roles: ''
        },
        about: '',
        aboutSubtitle: '',
        personalNote: '',
        whatIDo: '',
        education: '',
        certifications: '',
        stats: '',
        skills: [],
        services: [],
        projects: [],
        testimonials: [],
        footerDescription: '',
        contact: {
          email: '',
          phone: '',
          linkedin: '',
          github: ''
        }
      },
      seo: {
        title: '',
        description: '',
        keywords: []
      }
    }
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'content.skills'
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control,
    name: 'content.services'
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'content.projects'
  });

  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({
    control,
    name: 'content.testimonials'
  });

  useEffect(() => {
    if (id) {
      fetchPortfolio();
    } else {
      // Set template from query parameter for new portfolios
      const templateParam = searchParams.get('template');
      if (templateParam) {
        setValue('template', templateParam);
      }
    }
  }, [id, searchParams]);

  // Keyboard shortcut for live preview (Ctrl/Cmd + P)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowPreview(prev => !prev);
        toast.success(showPreview ? 'Live preview hidden' : 'Live preview enabled!');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showPreview]);

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get(`/portfolio/${id}`);
      const portfolio = data.portfolio;
      
      // Store views separately
      setPortfolioViews(portfolio.views || 0);
      
      // Convert hero roles array to newline-separated string
      if (portfolio.content?.hero?.roles && Array.isArray(portfolio.content.hero.roles)) {
        portfolio.content.hero.roles = portfolio.content.hero.roles.join('\n');
      }
      
      // Convert "What I Do" array to newline-separated string
      if (portfolio.content?.whatIDo && Array.isArray(portfolio.content.whatIDo)) {
        portfolio.content.whatIDo = portfolio.content.whatIDo.join('\n');
      }
      
      // Convert education array to newline-separated "Title | Institution | Year" format
      if (portfolio.content?.education && Array.isArray(portfolio.content.education) && portfolio.content.education.length > 0) {
        portfolio.content.education = portfolio.content.education
          .filter(edu => edu.title || edu.institution || edu.year) // Only include non-empty entries
          .map(edu => `${edu.title || ''} | ${edu.institution || ''} | ${edu.year || ''}`)
          .join('\n');
      } else {
        portfolio.content.education = '';
      }
      
      // Convert certifications array to newline-separated "Title | Institution | Date" format
      if (portfolio.content?.certifications && Array.isArray(portfolio.content.certifications) && portfolio.content.certifications.length > 0) {
        portfolio.content.certifications = portfolio.content.certifications
          .filter(cert => cert.title || cert.institution || cert.date) // Only include non-empty entries
          .map(cert => `${cert.title || ''} | ${cert.institution || ''} | ${cert.date || ''}`)
          .join('\n');
      } else {
        portfolio.content.certifications = '';
      }
      
      // Convert stats array to newline-separated "Number | Suffix | Label" format
      if (portfolio.content?.stats && Array.isArray(portfolio.content.stats) && portfolio.content.stats.length > 0) {
        portfolio.content.stats = portfolio.content.stats
          .filter(stat => stat.label) // Only include entries with labels
          .map(stat => `${stat.number || 0} | ${stat.suffix || ''} | ${stat.label || ''}`)
          .join('\n');
      } else {
        portfolio.content.stats = '';
      }
      
      // Convert services deliverables array to newline-separated string
      if (portfolio.content?.services && Array.isArray(portfolio.content.services) && portfolio.content.services.length > 0) {
        portfolio.content.services = portfolio.content.services.map(service => ({
          ...service,
          deliverables: Array.isArray(service.deliverables) 
            ? service.deliverables.join('\n')
            : service.deliverables || ''
        }));
      } else {
        portfolio.content.services = [];
      }
      
      // Convert arrays to comma-separated strings for form inputs
      if (portfolio.content?.skills) {
        portfolio.content.skills = portfolio.content.skills.map(skill => ({
          category: skill.category,
          items: Array.isArray(skill.items) ? skill.items.join(', ') : skill.items
        }));
      }
      
      if (portfolio.content?.projects) {
        portfolio.content.projects = portfolio.content.projects.map(project => ({
          ...project,
          technologies: Array.isArray(project.technologies) 
            ? project.technologies.join(', ') 
            : project.technologies,
          features: Array.isArray(project.features)
            ? project.features.join('\n')
            : project.features || ''
        }));
      }
      
      // Ensure testimonials array exists
      if (!portfolio.content?.testimonials) {
        portfolio.content.testimonials = [];
      }
      
      if (portfolio.seo?.keywords && Array.isArray(portfolio.seo.keywords)) {
        portfolio.seo.keywords = portfolio.seo.keywords.join(', ');
      }
      
      Object.keys(portfolio).forEach(key => {
        setValue(key, portfolio[key]);
      });
    } catch (error) {
      toast.error('Failed to load portfolio');
    }
  };

  const generateWithAI = async (customPrompt = '') => {
    setGenerating(true);
    setShowAIModal(false);
    
    const loadingToast = toast.loading('AI is generating your content...');
    
    try {
      const currentData = watch();
      const prompt = customPrompt || aiPrompt;
      
      const { data } = await api.post('/ai/portfolio-content', { 
        userData: currentData,
        customPrompt: prompt
      });
      
      // Parse AI response
      const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      
      // Detect what user wants to update based on prompt
      const lowerPrompt = prompt.toLowerCase();
      const isFillAll = lowerPrompt.includes('fill') || lowerPrompt.includes('generate all') || lowerPrompt.includes('complete');
      
      // Check for multiple items in prompt
      const mentionsAbout = lowerPrompt.includes('about');
      const mentionsHero = lowerPrompt.includes('hero');
      const mentionsSkills = lowerPrompt.includes('skill') || lowerPrompt.includes('frontend') || lowerPrompt.includes('backend') || lowerPrompt.includes('technology');
      const mentionsProjects = lowerPrompt.includes('project');
      const mentionsServices = lowerPrompt.includes('service');
      const mentionsTestimonials = lowerPrompt.includes('testimonial');
      const mentionsContact = lowerPrompt.includes('contact');
      
      // Count how many things are mentioned
      const mentionCount = [mentionsAbout, mentionsHero, mentionsSkills, mentionsProjects, mentionsServices, mentionsTestimonials, mentionsContact].filter(Boolean).length;
      const isMultipleItems = mentionCount > 1;
      
      // Only update fields that have meaningful content or if it's a fill-all request
      const shouldUpdate = (field, value) => {
        if (isFillAll) return true; // Update everything for fill-all
        
        // If multiple items mentioned, check if this field is one of them
        if (isMultipleItems) {
          if (mentionsAbout && (field.includes('about') || field.includes('personalNote') || field.includes('whatIDo') || field.includes('education') || field.includes('certification') || field.includes('stats'))) return true;
          if (mentionsHero && field.includes('hero')) return true;
          if (mentionsSkills && field.includes('skills')) return true;
          if (mentionsProjects && field.includes('projects')) return true;
          if (mentionsServices && field.includes('services')) return true;
          if (mentionsTestimonials && field.includes('testimonials')) return true;
          if (mentionsContact && field.includes('contact')) return true;
          return false; // Don't update other fields
        }
        
        // Single item mentioned
        if (mentionsAbout && !mentionsHero && !mentionsProjects) return field.includes('about') || field.includes('personalNote') || field.includes('whatIDo') || field.includes('education') || field.includes('certification') || field.includes('stats');
        if (mentionsHero && !mentionsAbout) return field.includes('hero');
        if (mentionsSkills && !mentionsProjects && !mentionsAbout) return field.includes('skills');
        if (mentionsProjects && !mentionsSkills && !mentionsAbout) return field.includes('projects');
        if (mentionsServices && !mentionsProjects) return field.includes('services');
        if (mentionsTestimonials) return field.includes('testimonials');
        if (mentionsContact) return field.includes('contact');
        
        // Default: only update if value is not empty
        return value && value !== '' && (!Array.isArray(value) || value.length > 0);
      };
      
      // Update hero section
      if (content.hero && shouldUpdate('hero', content.hero)) {
        if (content.hero.title) setValue('content.hero.title', content.hero.title);
        if (content.hero.subtitle) setValue('content.hero.subtitle', content.hero.subtitle);
        if (content.hero.description) setValue('content.hero.description', content.hero.description);
        if (content.hero.roles) setValue('content.hero.roles', content.hero.roles);
      }
      
      // Update about sections
      if (shouldUpdate('about', content.about) && content.about) setValue('content.about', content.about);
      if (shouldUpdate('aboutSubtitle', content.aboutSubtitle) && content.aboutSubtitle) setValue('content.aboutSubtitle', content.aboutSubtitle);
      if (shouldUpdate('personalNote', content.personalNote) && content.personalNote) setValue('content.personalNote', content.personalNote);
      if (shouldUpdate('whatIDo', content.whatIDo) && content.whatIDo) setValue('content.whatIDo', content.whatIDo);
      if (shouldUpdate('education', content.education) && content.education) setValue('content.education', content.education);
      if (shouldUpdate('certifications', content.certifications) && content.certifications) setValue('content.certifications', content.certifications);
      if (shouldUpdate('stats', content.stats) && content.stats) setValue('content.stats', content.stats);
      if (shouldUpdate('footerDescription', content.footerDescription) && content.footerDescription) setValue('content.footerDescription', content.footerDescription);
      
      // Update skills - SMART MERGE
      if (content.skills && Array.isArray(content.skills) && content.skills.length > 0 && shouldUpdate('skills', content.skills)) {
        const formattedSkills = content.skills.map((skill) => {
          const items = Array.isArray(skill.items) ? skill.items.join(', ') : skill.items;
          return { category: skill.category, items };
        });
        setValue('content.skills', formattedSkills);
      }
      
      // Update services
      if (content.services && Array.isArray(content.services) && content.services.length > 0 && shouldUpdate('services', content.services)) {
        setValue('content.services', content.services);
      }
      
      // Update projects - SMART MERGE
      if (content.projects && Array.isArray(content.projects) && content.projects.length > 0 && shouldUpdate('projects', content.projects)) {
        const existingProjects = currentData.content?.projects || [];
        
        const formattedProjects = content.projects.map((aiProject, index) => {
          const existing = existingProjects[index];
          const techs = Array.isArray(aiProject.technologies) 
            ? aiProject.technologies.join(', ') 
            : aiProject.technologies || '';
          
          // Preserve existing links and images
          return {
            name: aiProject.name || existing?.name || '',
            description: aiProject.description || existing?.description || '',
            technologies: techs || existing?.technologies || '',
            features: aiProject.features || existing?.features || '',
            tags: aiProject.tags || existing?.tags || [],
            liveLink: existing?.liveLink || aiProject.liveLink || '',
            githubLink: existing?.githubLink || aiProject.githubLink || '',
            image: existing?.image || ''
          };
        });
        
        setValue('content.projects', formattedProjects);
      }
      
      // Update testimonials
      if (content.testimonials && Array.isArray(content.testimonials) && content.testimonials.length > 0 && shouldUpdate('testimonials', content.testimonials)) {
        setValue('content.testimonials', content.testimonials);
      }
      
      // Update contact
      if (content.contact && shouldUpdate('contact', content.contact)) {
        if (content.contact.email) setValue('content.contact.email', content.contact.email);
        if (content.contact.phone) setValue('content.contact.phone', content.contact.phone);
        if (content.contact.linkedin) setValue('content.contact.linkedin', content.contact.linkedin);
        if (content.contact.github) setValue('content.contact.github', content.contact.github);
      }
      
      // Track AI enhancement
      trackEvent('ai_enhancement_used', { 
        type: 'portfolio',
        portfolioId: id 
      });
      
      setAiPrompt('');
      toast.dismiss(loadingToast);
      toast.success('✨ Portfolio content generated successfully!', {
        duration: 4000,
        icon: '🎉'
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || 'AI generation failed. Please try again.', {
        duration: 5000
      });
    } finally {
      setGenerating(false);
    }
  };

  const uploadProjectImage = async (e, projectIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingProjectImage(prev => ({ ...prev, [projectIndex]: true }));
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload/image', formData);
      setValue(`content.projects.${projectIndex}.image`, data.url);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Image upload failed');
    } finally {
      setUploadingProjectImage(prev => ({ ...prev, [projectIndex]: false }));
    }
  };

  const formatPortfolioData = (data) => {
    // Deep clone the data
    const formatted = JSON.parse(JSON.stringify(data));
    
    // Convert hero roles from newline-separated string to array
    if (formatted.content?.hero?.roles && typeof formatted.content.hero.roles === 'string') {
      formatted.content.hero.roles = formatted.content.hero.roles
        .split('\n')
        .map(r => r.trim())
        .filter(Boolean);
    }
    
    // Convert "What I Do" from newline-separated string to array
    if (formatted.content?.whatIDo && typeof formatted.content.whatIDo === 'string') {
      formatted.content.whatIDo = formatted.content.whatIDo
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean);
    }
    
    // Convert education from newline-separated "Title | Institution | Year" format to array of objects
    if (formatted.content?.education && typeof formatted.content.education === 'string') {
      formatted.content.education = formatted.content.education
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const parts = line.split('|').map(p => p.trim());
          return {
            title: parts[0] || '',
            institution: parts[1] || '',
            year: parts[2] || ''
          };
        })
        .filter(edu => edu.title || edu.institution || edu.year); // Remove completely empty entries
    }
    
    // Convert certifications from newline-separated "Title | Institution | Date" format to array of objects
    if (formatted.content?.certifications && typeof formatted.content.certifications === 'string') {
      formatted.content.certifications = formatted.content.certifications
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const parts = line.split('|').map(p => p.trim());
          return {
            title: parts[0] || '',
            institution: parts[1] || '',
            date: parts[2] || ''
          };
        })
        .filter(cert => cert.title || cert.institution || cert.date); // Remove completely empty entries
    }
    
    // Convert stats from newline-separated "Number | Suffix | Label" format to array of objects
    if (formatted.content?.stats && typeof formatted.content.stats === 'string') {
      formatted.content.stats = formatted.content.stats
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const parts = line.split('|').map(p => p.trim());
          return {
            number: parseInt(parts[0]) || 0,
            suffix: parts[1] || '',
            label: parts[2] || ''
          };
        })
        .filter(stat => stat.label); // Remove entries without labels
    }
    
    // Convert services deliverables from newline-separated string to array
    if (formatted.content?.services && Array.isArray(formatted.content.services)) {
      formatted.content.services = formatted.content.services.map((service, index) => ({
        ...service,
        id: index + 1,
        deliverables: typeof service.deliverables === 'string'
          ? service.deliverables.split('\n').map(d => d.trim()).filter(Boolean)
          : service.deliverables || []
      })).filter(service => service.title || service.description); // Remove completely empty entries
    }
    
    // Convert skills items from comma-separated strings to arrays
    if (formatted.content?.skills) {
      formatted.content.skills = formatted.content.skills.map(skill => ({
        category: skill.category,
        items: typeof skill.items === 'string' 
          ? skill.items.split(',').map(s => s.trim()).filter(Boolean)
          : skill.items
      }));
    }
    
    // Convert project technologies and features from strings to arrays
    if (formatted.content?.projects) {
      formatted.content.projects = formatted.content.projects.map(project => ({
        ...project,
        technologies: typeof project.technologies === 'string'
          ? project.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : project.technologies,
        features: typeof project.features === 'string'
          ? project.features.split('\n').map(f => f.trim()).filter(Boolean)
          : project.features || []
      }));
    }
    
    // Format testimonials - ensure rating is a number and filter out empty entries
    if (formatted.content?.testimonials && Array.isArray(formatted.content.testimonials)) {
      formatted.content.testimonials = formatted.content.testimonials
        .map(testimonial => ({
          ...testimonial,
          rating: parseInt(testimonial.rating) || 5
        }))
        .filter(testimonial => testimonial.name && testimonial.text); // Only keep testimonials with name and text
    }
    
    // Convert SEO keywords from comma-separated string to array
    if (formatted.seo?.keywords && typeof formatted.seo.keywords === 'string') {
      formatted.seo.keywords = formatted.seo.keywords.split(',').map(k => k.trim()).filter(Boolean);
    }
    
    return formatted;
  };

  const publishPortfolio = async () => {
    try {
      const portfolioData = watch();
      if (!portfolioData.subdomain) {
        toast.error('Please set a subdomain first');
        return;
      }

      const formattedData = formatPortfolioData(portfolioData);
      const { data } = await api.put(`/portfolio/${id}`, { ...formattedData, published: true });
      
      // Update the form to reflect published status
      setValue('published', true);
      
      toast.success('Portfolio published successfully! 🎉');
      
      // Open in new tab after a short delay
      setTimeout(() => {
        window.open(`/portfolio/public/${portfolioData.subdomain}`, '_blank');
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to publish');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedData = formatPortfolioData(data);
      
      // Debug: Log testimonials data
      console.log('Testimonials being saved:', formattedData.content?.testimonials);
      
      if (id) {
        await api.put(`/portfolio/${id}`, formattedData);
        toast.success('Portfolio updated!');
      } else {
        const response = await api.post('/portfolio', formattedData);
        
        // Track portfolio creation
        trackEvent('portfolio_created', { 
          portfolioId: response.data.portfolio._id,
          theme: formattedData.theme 
        });
        
        toast.success('Portfolio created!');
        navigate(`/portfolio/${response.data.portfolio._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save portfolio');
    } finally {
      setLoading(false);
    }
  };

  const portfolioData = { ...watch(), views: portfolioViews };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className={`container mx-auto px-3 sm:px-4 lg:px-6 transition-all duration-300 ${showPreview ? 'max-w-[95vw]' : 'max-w-4xl'}`}>
        <div className={`grid gap-4 lg:gap-6 transition-all duration-300 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          {/* Main Form */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 p-1">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold truncate">Portfolio Builder</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">
                  Create your professional online portfolio
                </p>
                {id && (
                  <div className="flex items-center gap-2 mt-1">
                    {watch('published') ? (
                      <span className="text-xs sm:text-sm px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded font-medium">
                        ✓ Published
                      </span>
                    ) : (
                      <span className="text-xs sm:text-sm px-2 py-0.5 sm:py-1 bg-yellow-100 text-yellow-700 rounded font-medium">
                        Draft
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowAIModal(true)}
                disabled={generating}
                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm sm:text-base font-medium flex-1 sm:flex-initial min-w-[120px] sm:min-w-[140px]"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">{generating ? 'Generating...' : 'AI Generate'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreview(!showPreview);
                  if (!showPreview) {
                    toast.success('Live preview enabled! See changes in real-time →', { duration: 3000 });
                  }
                }}
                className="hidden lg:flex items-center gap-2 bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm sm:text-base relative group"
                title="Toggle live preview"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{showPreview ? 'Hide Live Preview' : 'Live Preview'}</span>
                {!showPreview && (
                  <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Press Ctrl+P (⌘+P on Mac)
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="lg:hidden flex items-center gap-2 bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 text-sm sm:text-base"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Hidden input to ensure template is submitted */}
            <input type="hidden" {...register('template')} />
            
            {/* Logo & Profile Picture Upload */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <section>
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">Logo</h2>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Logo Text (Optional)</label>
                    <input
                      {...register('logoText')}
                      placeholder="e.g., Finesse, YourBrand"
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Custom text for your SVG logo. Leave empty to use your name.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Or Upload Custom Logo</label>
                    <div className="flex items-center gap-4 flex-wrap">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          if (file.size > 2 * 1024 * 1024) {
                            toast.error('Logo must be less than 2MB');
                            return;
                          }

                          setUploadingLogo(true);
                          const formData = new FormData();
                          formData.append('image', file);

                          try {
                            const { data } = await api.post('/upload/image', formData);
                            setValue('logoUrl', data.url);
                            toast.success('Logo uploaded!');
                          } catch (error) {
                            toast.error('Logo upload failed');
                          } finally {
                            setUploadingLogo(false);
                          }
                        }}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingLogo ? 'Uploading...' : 'Upload'}
                      </label>
                      {watch('logoUrl') && (
                        <>
                          <img
                            src={watch('logoUrl')}
                            alt="Logo preview"
                            className="h-12 w-auto object-contain bg-gray-900 px-2 py-1 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setValue('logoUrl', '')}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">PNG, SVG, or JPG, max 2MB</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">Profile Picture</h2>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Upload Your Photo</label>
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        if (file.size > 3 * 1024 * 1024) {
                          toast.error('Image must be less than 3MB');
                          return;
                        }

                        setUploadingProfile(true);
                        const formData = new FormData();
                        formData.append('image', file);

                        try {
                          const { data } = await api.post('/upload/image', formData);
                          setValue('profileImageUrl', data.url);
                          toast.success('Profile picture uploaded!');
                        } catch (error) {
                          toast.error('Upload failed');
                        } finally {
                          setUploadingProfile(false);
                        }
                      }}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg cursor-pointer hover:bg-gray-100 text-sm"
                    >
                      <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{uploadingProfile ? 'Uploading...' : 'Upload'}</span>
                    </label>
                    {watch('profileImageUrl') && (
                      <>
                        <img
                          src={watch('profileImageUrl')}
                          alt="Profile preview"
                          className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full"
                        />
                        <button
                          type="button"
                          onClick={() => setValue('profileImageUrl', '')}
                          className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">Square image recommended, max 3MB</p>
                </div>
              </section>
            </div>

            {/* Portfolio URL */}
            <section className="border-t pt-4 sm:pt-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">Portfolio URL</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  {...register('subdomain', { required: true })}
                  placeholder="your-name"
                  className="w-full sm:flex-1 px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
                <span className="text-xs sm:text-sm lg:text-base text-gray-600 whitespace-nowrap">.careercraftai.com</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">Choose a unique subdomain for your portfolio</p>
            </section>

            {/* Resume Upload */}
            <section className="border-t pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Resume/CV</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Your Resume (PDF)</label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        if (file.size > 5 * 1024 * 1024) {
                          toast.error('Resume must be less than 5MB');
                          return;
                        }

                        if (file.type !== 'application/pdf') {
                          toast.error('Only PDF files are allowed');
                          return;
                        }

                        setUploadingResume(true);
                        const formData = new FormData();
                        formData.append('image', file);

                        try {
                          const { data } = await api.post('/upload/image', formData);
                          setValue('resumeUrl', data.url);
                          toast.success('Resume uploaded!');
                        } catch (error) {
                          toast.error('Resume upload failed');
                        } finally {
                          setUploadingResume(false);
                        }
                      }}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                    </label>
                    {watch('resumeUrl') && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-green-600">✓ Resume uploaded</span>
                        <a
                          href={watch('resumeUrl')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          onClick={() => setValue('resumeUrl', '')}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Upload your resume to allow visitors to download it</p>
                </div>
              </div>
            </section>

            {/* Template Selection */}
            <section className="border-t pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Portfolio Template</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Choose a layout structure for your portfolio. Each template has a unique design and layout style.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs sm:text-sm text-blue-800">
                <strong>💡 Tip:</strong> You can change your template anytime. Try different templates to see which one best showcases your work!
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {portfolioTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setValue('template', template.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                      watch('template') === template.id
                        ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <h3 className="text-base font-bold mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                          {feature}
                        </span>
                      ))}
                    </div>
                    {watch('template') === template.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>Selected: {portfolioTemplates.find(t => t.id === watch('template'))?.name}</strong> - 
                  {' '}{portfolioTemplates.find(t => t.id === watch('template'))?.description}
                </p>
              </div>
            </section>

            {/* Color Theme */}
            <section className="border-t pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Color Theme</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Choose a color scheme for your portfolio</p>
              
              {(() => {
                const allThemes = [
                  { name: 'Purple & Pink', from: '#a855f7', to: '#ec4899', value: 'purple-pink' },
                  { name: 'Ocean Blue', from: '#3b82f6', to: '#06b6d4', value: 'blue-cyan' },
                  { name: 'Forest Green', from: '#22c55e', to: '#14b8a6', value: 'green-teal' },
                  { name: 'Sunset Fire', from: '#f97316', to: '#ef4444', value: 'orange-red' },
                  { name: 'Royal Indigo', from: '#6366f1', to: '#a855f7', value: 'indigo-purple' },
                  { name: 'Rose Garden', from: '#ec4899', to: '#f43f5e', value: 'pink-rose' },
                  { name: 'Golden Sun', from: '#eab308', to: '#f97316', value: 'yellow-orange' },
                  { name: 'Emerald Forest', from: '#10b981', to: '#22c55e', value: 'emerald-green' },
                  { name: 'Violet Dream', from: '#8b5cf6', to: '#d946ef', value: 'violet-fuchsia' },
                  { name: 'Sky Blue', from: '#0ea5e9', to: '#38bdf8', value: 'sky-blue' },
                  { name: 'Lime Fresh', from: '#84cc16', to: '#a3e635', value: 'lime-green' },
                  { name: 'Amber Glow', from: '#f59e0b', to: '#fbbf24', value: 'amber-yellow' },
                  { name: 'Crimson Red', from: '#dc2626', to: '#ef4444', value: 'red-crimson' },
                  { name: 'Slate Gray', from: '#64748b', to: '#94a3b8', value: 'slate-gray' },
                  { name: 'Mint Turquoise', from: '#2dd4bf', to: '#5eead4', value: 'mint-turquoise' },
                  { name: 'Coral Peach', from: '#fb7185', to: '#fda4af', value: 'coral-peach' },
                  { name: 'Navy Blue', from: '#1e40af', to: '#3b82f6', value: 'navy-blue' },
                  { name: 'Magenta Purple', from: '#c026d3', to: '#e879f9', value: 'magenta-purple' },
                ];
                
                const INITIAL_THEME_COUNT = 8;
                const displayedThemes = showAllThemes ? allThemes : allThemes.slice(0, INITIAL_THEME_COUNT);
                
                return (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {displayedThemes.map((theme) => (
                        <button
                          key={theme.value}
                          type="button"
                          onClick={() => setValue('colorTheme', theme.value)}
                          className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all ${
                            watch('colorTheme') === theme.value
                              ? 'border-indigo-600 ring-2 ring-indigo-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className="h-10 sm:h-12 rounded-md mb-2"
                            style={{ backgroundImage: `linear-gradient(to right, ${theme.from}, ${theme.to})` }}
                          ></div>
                          <p className="text-xs sm:text-sm font-medium text-center leading-tight">{theme.name}</p>
                          {watch('colorTheme') === theme.value && (
                            <div className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {allThemes.length > INITIAL_THEME_COUNT && (
                      <div className="mt-4 sm:mt-6 text-center">
                        <button
                          type="button"
                          onClick={() => setShowAllThemes(!showAllThemes)}
                          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-sm sm:text-base"
                        >
                          {showAllThemes ? 'Show Less' : `Show All Themes (${allThemes.length})`}
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </section>

            {/* Hero Section */}
            <section className="border-t pt-4 sm:pt-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">Hero Section</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Your Name</label>
                  <input
                    {...register('content.hero.title')}
                    placeholder="Your Name"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Tagline (Optional)</label>
                  <input
                    {...register('content.hero.subtitle')}
                    placeholder="e.g., Hey, I'm (leave empty for default)"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to use "Hey, I'm" as default</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Typing Animation Roles (Professional Template)</label>
                  <textarea
                    {...register('content.hero.roles')}
                    rows="3"
                    placeholder="Full-Stack MERN Developer&#10;React & Node.js Expert&#10;Web Application Developer"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter each role on a new line. These will rotate with typing animation.</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Brief Introduction</label>
                  <textarea
                    {...register('content.hero.description')}
                    rows="3"
                    placeholder="Brief introduction about yourself..."
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>
            </section>

            {/* About */}
            <section className="border-t pt-4 sm:pt-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">About Me</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">About Subtitle (Professional Template)</label>
                  <input
                    {...register('content.aboutSubtitle')}
                    placeholder="e.g., Full-Stack Developer crafting modern web experiences"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">Short tagline for the About section</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">About Description</label>
                  <textarea
                    {...register('content.about')}
                    rows="5"
                    placeholder="Tell your story, background, and what drives you..."
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Personal Note (Professional Template)</label>
                  <input
                    {...register('content.personalNote')}
                    placeholder="e.g., Minimalist design lover • Always learning something new"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">Short personal note or tagline</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">What I Do (Professional Template)</label>
                  <textarea
                    {...register('content.whatIDo')}
                    rows="4"
                    placeholder="Full-stack web app development with MERN stack&#10;REST APIs, authentication & database design&#10;Frontend UI/UX with React, Next.js & Tailwind&#10;Real-time features, payments & dashboards"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter each item on a new line</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Education (Professional Template)</label>
                  <textarea
                    {...register('content.education')}
                    rows="4"
                    placeholder="Bachelor in Information Management (BIM) | Tribhuvan University | 2021 - 2026&#10;Project-Based Learning | Hands-on experience with real-world MERN projects | 2023 - Present"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: Title | Institution | Year (one per line)</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Certifications (Professional Template)</label>
                  <textarea
                    {...register('content.certifications')}
                    rows="4"
                    placeholder="Hackathon by KEC I.T. | KEC I.T. Club | January 9 to January 11, 2025&#10;Front-End Development with React.js | KIST College of Management | July 22 to August 13, 2024"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: Title | Institution | Date (one per line)</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Quick Stats (Professional Template)</label>
                  <textarea
                    {...register('content.stats')}
                    rows="4"
                    placeholder="3 | + | Years Experience&#10;12 | + | Projects Built&#10;12 |  | Live Apps&#10;20 | + | Technologies"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: Number | Suffix | Label (one per line, e.g., "3 | + | Years Experience")</p>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className="border-t pt-4 sm:pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Skills</h2>
                <button
                  type="button"
                  onClick={() => appendSkill({ category: '', items: [''] })}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline whitespace-nowrap">Add Skill Category</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {skillFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 sm:gap-4 items-start p-3 sm:p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <input
                        {...register(`content.skills.${index}.category`)}
                        placeholder="Category (e.g., Frontend)"
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                      <input
                        {...register(`content.skills.${index}.items`)}
                        placeholder="Skills (comma-separated)"
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-red-600 hover:text-red-700 mt-2 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section className="border-t pt-4 sm:pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Services (Professional Template)</h2>
                <button
                  type="button"
                  onClick={() => appendService({ title: '', description: '', icon: '', badge: '', deliverables: '' })}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline whitespace-nowrap">Add Service</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {serviceFields.map((field, index) => (
                  <div key={field.id} className="p-3 sm:p-4 lg:p-6 border rounded-lg bg-gray-50 shadow-sm">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800">Service {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0 p-1"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Service Title</label>
                          <input
                            {...register(`content.services.${index}.title`)}
                            placeholder="Full-Stack Web Development"
                            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Badge</label>
                          <input
                            {...register(`content.services.${index}.badge`)}
                            placeholder="Full-Stack"
                            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Icon Name</label>
                        <select
                          {...register(`content.services.${index}.icon`)}
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white"
                        >
                          <option value="">Select an icon</option>
                          <option value="CodeBracketIcon">Code Bracket (Development)</option>
                          <option value="ShoppingCartIcon">Shopping Cart (E-commerce)</option>
                          <option value="SparklesIcon">Sparkles (AI/Innovation)</option>
                          <option value="ChartBarIcon">Chart Bar (Analytics/Dashboard)</option>
                          <option value="DevicePhoneMobileIcon">Mobile Device (Mobile Apps)</option>
                          <option value="GlobeAltIcon">Globe (Web/Global)</option>
                          <option value="CpuChipIcon">CPU Chip (Tech/Performance)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Description</label>
                        <textarea
                          {...register(`content.services.${index}.description`)}
                          rows="3"
                          placeholder="End-to-end MERN stack applications with secure authentication..."
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Key Deliverables (one per line)</label>
                        <textarea
                          {...register(`content.services.${index}.deliverables`)}
                          rows="4"
                          placeholder="Complete MERN-stack solutions&#10;Real-time features (chat, notifications)&#10;Secure authentication & authorization&#10;Database design & API integration"
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-mono"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter each deliverable on a new line</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className="border-t pt-4 sm:pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Projects</h2>
                <button
                  type="button"
                  onClick={() => appendProject({ name: '', description: '', image: '', technologies: [], features: '', liveLink: '', githubLink: '', tags: [] })}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline whitespace-nowrap">Add Project</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {projectFields.map((field, index) => (
                  <div key={field.id} className="p-3 sm:p-4 lg:p-6 border rounded-lg bg-gray-50 shadow-sm">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800">Project {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0 p-1"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Project Name</label>
                        <input
                          {...register(`content.projects.${index}.name`)}
                          placeholder="Project Name"
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Tags (select multiple)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Recent', 'AI / ML', 'Full-Stack', 'Web', 'Real-Time / Socket', 'Frontend', 'E-commerce'].map((tagOption) => (
                            <label key={tagOption} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                value={tagOption}
                                {...register(`content.projects.${index}.tags`)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm">{tagOption}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Description</label>
                        <textarea
                          {...register(`content.projects.${index}.description`)}
                          rows="3"
                          placeholder="Project description and key features..."
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Technologies (comma-separated)</label>
                        <input
                          {...register(`content.projects.${index}.technologies`)}
                          placeholder="React, Node.js, MongoDB"
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Key Features (one per line)</label>
                        <textarea
                          {...register(`content.projects.${index}.features`)}
                          rows="4"
                          placeholder="User authentication & authorization&#10;Real-time chat functionality&#10;Payment gateway integration&#10;Admin dashboard with analytics"
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-mono"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Live Demo URL</label>
                          <input
                            {...register(`content.projects.${index}.liveLink`)}
                            placeholder="https://..."
                            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">GitHub URL</label>
                          <input
                            {...register(`content.projects.${index}.githubLink`)}
                            placeholder="https://github.com/..."
                            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-700">Project Image</label>
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => uploadProjectImage(e, index)}
                            className="hidden"
                            id={`project-image-${index}`}
                          />
                          <label
                            htmlFor={`project-image-${index}`}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-100 text-sm sm:text-base"
                          >
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">{uploadingProjectImage[index] ? 'Uploading...' : 'Upload Image'}</span>
                            <span className="sm:hidden">{uploadingProjectImage[index] ? 'Uploading...' : 'Upload'}</span>
                          </label>
                          {watch(`content.projects.${index}.image`) && (
                            <>
                              <img
                                src={watch(`content.projects.${index}.image`)}
                                alt="Project preview"
                                className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => setValue(`content.projects.${index}.image`, '')}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="border-t pt-4 sm:pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Testimonials</h2>
                <button
                  type="button"
                  onClick={() => appendTestimonial({ name: '', role: '', company: '', image: '', text: '', rating: 5, projectType: '' })}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline whitespace-nowrap">Add Testimonial</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {testimonialFields.map((field, index) => (
                  <div key={field.id} className="p-3 sm:p-4 lg:p-6 border rounded-lg bg-gray-50 shadow-sm">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800">Testimonial {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0 p-1"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Name</label>
                          <input
                            {...register(`content.testimonials.${index}.name`)}
                            placeholder="John Doe"
                            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Role</label>
                          <input
                            {...register(`content.testimonials.${index}.role`)}
                            placeholder="Senior Developer"
                            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Company</label>
                          <input
                            {...register(`content.testimonials.${index}.company`)}
                            placeholder="Tech Company Inc."
                            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Project Type</label>
                          <input
                            {...register(`content.testimonials.${index}.projectType`)}
                            placeholder="E-Commerce, Dashboard, Portfolio, etc."
                            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Image URL</label>
                        <input
                          {...register(`content.testimonials.${index}.image`)}
                          placeholder="https://ui-avatars.com/api/?name=John+Doe&background=a855f7&color=fff"
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        />
                        <p className="text-xs text-gray-500 mt-1">Use ui-avatars.com for quick avatar generation</p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Rating</label>
                        <select
                          {...register(`content.testimonials.${index}.rating`)}
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Testimonial Text</label>
                        <textarea
                          {...register(`content.testimonials.${index}.text`)}
                          rows="4"
                          placeholder="Write what the client said about your work..."
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section className="border-t pt-4 sm:pt-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Email</label>
                  <input
                    {...register('content.contact.email')}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Phone</label>
                  <input
                    {...register('content.contact.phone')}
                    placeholder="+977 98-12345678"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">LinkedIn</label>
                  <input
                    {...register('content.contact.linkedin')}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">GitHub</label>
                  <input
                    {...register('content.contact.github')}
                    placeholder="https://github.com/..."
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>
            </section>

            {/* Footer */}
            <section className="border-t pt-4 sm:pt-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">Footer Settings</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Footer Description</label>
                  <textarea
                    {...register('content.footerDescription')}
                    rows="2"
                    placeholder="Full-Stack Developer crafting modern web applications with clean code and seamless user experiences."
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">Brief description shown in the footer</p>
                </div>
              </div>
            </section>

            {/* SEO */}
            <section className="border-t pt-4 sm:pt-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">SEO Settings</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">SEO Title</label>
                  <input
                    {...register('seo.title')}
                    placeholder="Your Name - Full Stack Developer"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">SEO Description</label>
                  <textarea
                    {...register('seo.description')}
                    rows="2"
                    placeholder="Brief description for search engines..."
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">Keywords</label>
                  <input
                    {...register('seo.keywords')}
                    placeholder="web developer, react, nodejs"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 border-t pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto font-medium"
              >
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{loading ? 'Saving...' : 'Save Portfolio'}</span>
              </button>
              {id && (
                <>
                  <button
                    type="button"
                    onClick={publishPortfolio}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto font-medium"
                  >
                    <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{watch('published') ? 'Update & Publish' : 'Publish'}</span>
                  </button>
                  {watch('published') && watch('subdomain') && (
                    <a
                      href={`/portfolio/public/${watch('subdomain')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-700 text-sm sm:text-base w-full sm:w-auto font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">View Live</span>
                    </a>
                  )}
                </>
              )}
              {!id && (
                <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center sm:justify-start px-2">
                  💡 Save your portfolio first, then you can publish it
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Live Preview Panel - Desktop Only */}
        {showPreview && (
          <div className="hidden lg:block bg-gray-900 rounded-lg shadow-lg p-4 overflow-hidden sticky top-20" style={{ height: 'calc(100vh - 2rem)' }}>
            <div className="mb-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" />
                <span>Live Preview</span>
                <span className="text-xs text-gray-400 font-normal">(Updates as you type)</span>
              </h3>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-y-auto overflow-x-hidden" style={{ height: 'calc(100% - 3rem)', transform: 'translateZ(0)' }}>
              <div style={{
                zoom: '0.6',
                width: '100%'
              }}>
                <PortfolioLivePreview key={portfolioViews} data={portfolioData} />
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Mobile Preview Modal */}
      {showPreview && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0 bg-white z-10">
              <h3 className="text-lg font-semibold">Live Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-900" style={{ transform: 'translateZ(0)' }}>
              <PortfolioLivePreview key={`${portfolioData.colorTheme}-${portfolioData.template}`} data={portfolioData} />
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
              <span>AI Portfolio Generator</span>
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Describe what you want the AI to generate or improve in your portfolio.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <p className="font-semibold text-blue-900">✨ What the AI can do:</p>
              <p className="text-blue-800">• <strong>Add specific content:</strong> "Add React and TypeScript to my skills"</p>
              <p className="text-blue-800">• <strong>Create new items:</strong> "Create a project about e-commerce"</p>
              <p className="text-blue-800">• <strong>Improve existing:</strong> "Make my about section more professional"</p>
              <p className="text-blue-800">• <strong>Generate multiple:</strong> "Add 3 more web development projects"</p>
              <p className="text-blue-800">• <strong>Enhance everything:</strong> "Make all content more achievement-focused"</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 text-xs sm:text-sm text-green-800">
              <strong>💡 Pro tip:</strong> The AI will preserve your existing content and only modify what you ask for. Be specific for best results!
            </div>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Enter your instructions for the AI... (or leave empty for automatic generation)"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm sm:text-base"
              rows="4"
            />

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => generateWithAI()}
                disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">{generating ? 'Generating...' : 'Generate with AI'}</span>
              </button>
              <button
                onClick={() => {
                  setShowAIModal(false);
                  setAiPrompt('');
                }}
                disabled={generating}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
