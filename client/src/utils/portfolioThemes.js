// Comprehensive portfolio theme configurations
export const portfolioThemes = {
  'purple-pink': {
    name: 'Purple & Pink',
    primary: '#a855f7',
    secondary: '#ec4899',
    primaryHover: '#9333ea',
    secondaryHover: '#db2777',
    accent: '#f0abfc',
    background: '#0F0F0F',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#ADB7BE',
    border: '#2d2d2d',
    shadow: 'rgba(168, 85, 247, 0.5)',
    glow: 'rgba(168, 85, 247, 0.15)',
    skillBg: 'rgba(168, 85, 247, 0.1)',
    skillBorder: 'rgba(168, 85, 247, 0.3)'
  },
  'blue-cyan': {
    name: 'Ocean Blue',
    primary: '#3b82f6',
    secondary: '#06b6d4',
    primaryHover: '#2563eb',
    secondaryHover: '#0891b2',
    accent: '#7dd3fc',
    background: '#0a0e1a',
    surface: '#1a1f2e',
    text: '#ffffff',
    textSecondary: '#94a3b8',
    border: '#1e293b',
    shadow: 'rgba(59, 130, 246, 0.5)',
    glow: 'rgba(59, 130, 246, 0.15)',
    skillBg: 'rgba(59, 130, 246, 0.1)',
    skillBorder: 'rgba(59, 130, 246, 0.3)'
  },
  'green-teal': {
    name: 'Forest Green',
    primary: '#22c55e',
    secondary: '#14b8a6',
    primaryHover: '#16a34a',
    secondaryHover: '#0d9488',
    accent: '#6ee7b7',
    background: '#0a1410',
    surface: '#1a2520',
    text: '#ffffff',
    textSecondary: '#a7c4bc',
    border: '#1e3a2e',
    shadow: 'rgba(34, 197, 94, 0.5)',
    glow: 'rgba(34, 197, 94, 0.15)',
    skillBg: 'rgba(34, 197, 94, 0.1)',
    skillBorder: 'rgba(34, 197, 94, 0.3)'
  },
  'orange-red': {
    name: 'Sunset Fire',
    primary: '#f97316',
    secondary: '#ef4444',
    primaryHover: '#ea580c',
    secondaryHover: '#dc2626',
    accent: '#fdba74',
    background: '#1a0a05',
    surface: '#2a1510',
    text: '#ffffff',
    textSecondary: '#d4a89f',
    border: '#3a2520',
    shadow: 'rgba(249, 115, 22, 0.5)',
    glow: 'rgba(249, 115, 22, 0.15)',
    skillBg: 'rgba(249, 115, 22, 0.1)',
    skillBorder: 'rgba(249, 115, 22, 0.3)'
  },
  'indigo-purple': {
    name: 'Royal Indigo',
    primary: '#6366f1',
    secondary: '#a855f7',
    primaryHover: '#4f46e5',
    secondaryHover: '#9333ea',
    accent: '#c4b5fd',
    background: '#0d0a1a',
    surface: '#1a152e',
    text: '#ffffff',
    textSecondary: '#b4a7d6',
    border: '#2a1f3a',
    shadow: 'rgba(99, 102, 241, 0.5)',
    glow: 'rgba(99, 102, 241, 0.15)',
    skillBg: 'rgba(99, 102, 241, 0.1)',
    skillBorder: 'rgba(99, 102, 241, 0.3)'
  },
  'pink-rose': {
    name: 'Rose Garden',
    primary: '#ec4899',
    secondary: '#f43f5e',
    primaryHover: '#db2777',
    secondaryHover: '#e11d48',
    accent: '#fbcfe8',
    background: '#1a0510',
    surface: '#2a1520',
    text: '#ffffff',
    textSecondary: '#d4a7bc',
    border: '#3a2530',
    shadow: 'rgba(236, 72, 153, 0.5)',
    glow: 'rgba(236, 72, 153, 0.15)',
    skillBg: 'rgba(236, 72, 153, 0.1)',
    skillBorder: 'rgba(236, 72, 153, 0.3)'
  },
  'yellow-orange': {
    name: 'Golden Sun',
    primary: '#eab308',
    secondary: '#f97316',
    primaryHover: '#ca8a04',
    secondaryHover: '#ea580c',
    accent: '#fde047',
    background: '#1a1505',
    surface: '#2a2510',
    text: '#ffffff',
    textSecondary: '#d4c89f',
    border: '#3a3520',
    shadow: 'rgba(234, 179, 8, 0.5)',
    glow: 'rgba(234, 179, 8, 0.15)',
    skillBg: 'rgba(234, 179, 8, 0.1)',
    skillBorder: 'rgba(234, 179, 8, 0.3)'
  },
  'emerald-green': {
    name: 'Emerald Forest',
    primary: '#10b981',
    secondary: '#22c55e',
    primaryHover: '#059669',
    secondaryHover: '#16a34a',
    accent: '#6ee7b7',
    background: '#051a10',
    surface: '#102a1a',
    text: '#ffffff',
    textSecondary: '#9fc4b0',
    border: '#1e3a2a',
    shadow: 'rgba(16, 185, 129, 0.5)',
    glow: 'rgba(16, 185, 129, 0.15)',
    skillBg: 'rgba(16, 185, 129, 0.1)',
    skillBorder: 'rgba(16, 185, 129, 0.3)'
  }
};

export const getThemeColors = (colorTheme = 'purple-pink') => {
  return portfolioThemes[colorTheme] || portfolioThemes['purple-pink'];
};

// Apply theme as CSS custom properties
export const applyThemeVariables = (colorTheme = 'purple-pink') => {
  const theme = getThemeColors(colorTheme);
  return {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-primary-hover': theme.primaryHover,
    '--theme-secondary-hover': theme.secondaryHover,
    '--theme-accent': theme.accent,
    '--theme-background': theme.background,
    '--theme-surface': theme.surface,
    '--theme-text': theme.text,
    '--theme-text-secondary': theme.textSecondary,
    '--theme-border': theme.border,
    '--theme-shadow': theme.shadow,
    '--theme-glow': theme.glow,
    '--theme-skill-bg': theme.skillBg,
    '--theme-skill-border': theme.skillBorder
  };
};
