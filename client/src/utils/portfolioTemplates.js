// Portfolio template configurations
export const portfolioTemplates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Classic corporate design with structured layout',
    preview: '💼',
    features: ['Business-like', 'Structured', 'Professional']
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean UI with big typography and motion effects',
    preview: '🎨',
    features: ['Bold hero', 'Glassmorphism', 'Smooth animations']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Super-clean with whitespace and typography focus',
    preview: '✨',
    features: ['Whitespace-heavy', 'Simple', 'Elegant']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Animated, artistic with bold colors and unique layouts',
    preview: '🚀',
    features: ['Animated', 'Bold colors', 'Artistic']
  }
];

export const getTemplateConfig = (templateId) => {
  return portfolioTemplates.find(t => t.id === templateId) || portfolioTemplates[0];
};
