import { 
  FaCode, FaChartBar, FaCheckCircle, FaPaintBrush, 
  FaMobile, FaLock 
} from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';

/**
 * Safely get an icon from a library
 * @param {object} library - Icon library (FaIcons or SiIcons)
 * @param {string} iconName - Name of the icon
 * @param {string} className - CSS classes
 * @returns {JSX.Element|null} Icon component or null
 */
const safeGetIcon = (library, iconName, className) => {
  try {
    const IconComponent = library[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
  } catch (error) {
    // Icon doesn't exist, return null
  }
  return null;
};

/**
 * Get icon component for a skill name
 * @param {string} skill - The skill name
 * @param {string} size - Icon size class (default: 'text-xl')
 * @returns {JSX.Element} Icon component
 */
export const getSkillIcon = (skill, size = 'text-xl') => {
  const skillLower = skill.toLowerCase().trim();
  
  // Icon mapping: [iconLibrary, iconName, color]
  const iconMap = {
    // AI/ML & Data Science
    'tensorflow': [SiIcons, 'SiTensorflow', 'text-orange-500'],
    'pytorch': [SiIcons, 'SiPytorch', 'text-red-500'],
    'scikit': [SiIcons, 'SiScikitlearn', 'text-orange-400'],
    'sklearn': [SiIcons, 'SiScikitlearn', 'text-orange-400'],
    'keras': [SiIcons, 'SiKeras', 'text-red-600'],
    'opencv': [SiIcons, 'SiOpencv', 'text-green-500'],
    'pandas': [SiIcons, 'SiPandas', 'text-blue-600'],
    'numpy': [SiIcons, 'SiNumpy', 'text-blue-500'],
    'jupyter': [SiIcons, 'SiJupyter', 'text-orange-500'],
    'spark': [SiIcons, 'SiApachespark', 'text-orange-600'],
    'kafka': [SiIcons, 'SiApachekafka', 'text-black'],
    'tableau': [SiIcons, 'SiTableau', 'text-blue-500'],
    'power bi': [SiIcons, 'SiPowerbi', 'text-yellow-500'],
    'powerbi': [SiIcons, 'SiPowerbi', 'text-yellow-500'],
    'matplotlib': [FaIcons, 'FaChartLine', 'text-blue-600'],
    'seaborn': [FaIcons, 'FaChartBar', 'text-teal-500'],
    'machine learning': [FaIcons, 'FaBrain', 'text-purple-500'],
    'ml': [FaIcons, 'FaBrain', 'text-purple-500'],
    'artificial intelligence': [FaIcons, 'FaRobot', 'text-blue-500'],
    'ai': [FaIcons, 'FaRobot', 'text-blue-500'],
    'data science': [FaIcons, 'FaChartLine', 'text-green-500'],
    'data analysis': [FaIcons, 'FaChartLine', 'text-green-500'],
    'deep learning': [FaIcons, 'FaProjectDiagram', 'text-purple-600'],
    
    // Frontend Frameworks
    'react native': [FaIcons, 'FaReact', 'text-cyan-400'],
    'react': [FaIcons, 'FaReact', 'text-cyan-400'],
    'vue': [FaIcons, 'FaVuejs', 'text-green-500'],
    'vuejs': [FaIcons, 'FaVuejs', 'text-green-500'],
    'angular': [FaIcons, 'FaAngular', 'text-red-600'],
    'svelte': [SiIcons, 'SiSvelte', 'text-orange-500'],
    'next': [SiIcons, 'SiNextdotjs', 'text-white'],
    'nextjs': [SiIcons, 'SiNextdotjs', 'text-white'],
    'nuxt': [SiIcons, 'SiNuxtdotjs', 'text-green-400'],
    'gatsby': [SiIcons, 'SiGatsby', 'text-purple-600'],
    'remix': [SiIcons, 'SiRemix', 'text-blue-400'],
    'jquery': [SiIcons, 'SiJquery', 'text-blue-500'],
    
    // Languages
    'javascript': [SiIcons, 'SiJavascript', 'text-yellow-400'],
    'js': [SiIcons, 'SiJavascript', 'text-yellow-400'],
    'typescript': [SiIcons, 'SiTypescript', 'text-blue-600'],
    'ts': [SiIcons, 'SiTypescript', 'text-blue-600'],
    'python': [FaIcons, 'FaPython', 'text-[#3776AB]'],
    'java': [FaIcons, 'FaJava', 'text-orange-400'],
    'c++': [SiIcons, 'SiCplusplus', 'text-blue-500'],
    'cpp': [SiIcons, 'SiCplusplus', 'text-blue-500'],
    'c#': [FaIcons, 'FaCode', 'text-purple-600'],
    'csharp': [FaIcons, 'FaCode', 'text-purple-600'],
    'go': [SiIcons, 'SiGo', 'text-cyan-400'],
    'golang': [SiIcons, 'SiGo', 'text-cyan-400'],
    'rust': [SiIcons, 'SiRust', 'text-orange-600'],
    'php': [FaIcons, 'FaPhp', 'text-indigo-300'],
    'ruby': [FaIcons, 'FaCode', 'text-red-500'],
    'swift': [FaIcons, 'FaSwift', 'text-orange-500'],
    'kotlin': [SiIcons, 'SiKotlin', 'text-purple-500'],
    
    // HTML & CSS
    'html': [FaIcons, 'FaHtml5', 'text-orange-500'],
    'css': [FaIcons, 'FaCss3Alt', 'text-blue-500'],
    'sass': [FaIcons, 'FaSass', 'text-pink-500'],
    'scss': [FaIcons, 'FaSass', 'text-pink-500'],
    'less': [SiIcons, 'SiLess', 'text-blue-600'],
    'tailwind': [SiIcons, 'SiTailwindcss', 'text-teal-400'],
    'bootstrap': [FaIcons, 'FaBootstrap', 'text-purple-600'],
    'material': [SiIcons, 'SiMaterialdesign', 'text-blue-500'],
    'mui': [SiIcons, 'SiMui', 'text-blue-500'],
    'chakra': [SiIcons, 'SiChakraui', 'text-teal-400'],
    'ant design': [SiIcons, 'SiAntdesign', 'text-red-500'],
    
    // Backend
    'node': [FaIcons, 'FaNodeJs', 'text-green-500'],
    'nodejs': [FaIcons, 'FaNodeJs', 'text-green-500'],
    'express': [SiIcons, 'SiExpress', 'text-white'],
    'nest': [SiIcons, 'SiNestjs', 'text-red-500'],
    'nestjs': [SiIcons, 'SiNestjs', 'text-red-500'],
    'django': [SiIcons, 'SiDjango', 'text-green-700'],
    'flask': [SiIcons, 'SiFlask', 'text-white'],
    'spring': [SiIcons, 'SiSpring', 'text-green-500'],
    'laravel': [SiIcons, 'SiLaravel', 'text-red-600'],
    'rails': [SiIcons, 'SiRubyonrails', 'text-red-500'],
    '.net': [SiIcons, 'SiDotnet', 'text-purple-600'],
    'dotnet': [SiIcons, 'SiDotnet', 'text-purple-600'],
    
    // Databases
    'mongodb': [SiIcons, 'SiMongodb', 'text-green-500'],
    'mongo': [SiIcons, 'SiMongodb', 'text-green-500'],
    'postgresql': [SiIcons, 'SiPostgresql', 'text-blue-400'],
    'postgres': [SiIcons, 'SiPostgresql', 'text-blue-400'],
    'mysql': [SiIcons, 'SiMysql', 'text-blue-500'],
    'redis': [SiIcons, 'SiRedis', 'text-red-500'],
    'firebase': [SiIcons, 'SiFirebase', 'text-yellow-500'],
    'supabase': [SiIcons, 'SiSupabase', 'text-green-500'],
    'sqlite': [SiIcons, 'SiSqlite', 'text-blue-400'],
    'sql': [FaIcons, 'FaDatabase', 'text-purple-400'],
    'database': [FaIcons, 'FaDatabase', 'text-purple-400'],
    
    // DevOps & Cloud
    'docker': [SiIcons, 'SiDocker', 'text-blue-500'],
    'kubernetes': [SiIcons, 'SiKubernetes', 'text-blue-600'],
    'k8s': [SiIcons, 'SiKubernetes', 'text-blue-600'],
    'aws': [FaIcons, 'FaAws', 'text-orange-400'],
    'amazon': [FaIcons, 'FaAws', 'text-orange-400'],
    'azure': [FaIcons, 'FaCloud', 'text-blue-500'],
    'microsoft azure': [FaIcons, 'FaCloud', 'text-blue-500'],
    'gcp': [SiIcons, 'SiGooglecloud', 'text-blue-400'],
    'google cloud': [SiIcons, 'SiGooglecloud', 'text-blue-400'],
    'heroku': [SiIcons, 'SiHeroku', 'text-purple-600'],
    'vercel': [SiIcons, 'SiVercel', 'text-white'],
    'netlify': [SiIcons, 'SiNetlify', 'text-teal-400'],
    'terraform': [SiIcons, 'SiTerraform', 'text-purple-600'],
    'jenkins': [SiIcons, 'SiJenkins', 'text-red-500'],
    'github actions': [SiIcons, 'SiGithubactions', 'text-blue-500'],
    'gitlab': [SiIcons, 'SiGitlab', 'text-orange-600'],
    
    // Tools
    'git': [FaIcons, 'FaGitAlt', 'text-orange-500'],
    'github': [FaIcons, 'FaGithub', 'text-white'],
    'npm': [FaIcons, 'FaNpm', 'text-red-600'],
    'yarn': [FaIcons, 'FaYarn', 'text-blue-400'],
    'pnpm': [SiIcons, 'SiPnpm', 'text-yellow-500'],
    'webpack': [SiIcons, 'SiWebpack', 'text-blue-400'],
    'vite': [SiIcons, 'SiVite', 'text-purple-400'],
    'eslint': [SiIcons, 'SiEslint', 'text-purple-600'],
    'prettier': [SiIcons, 'SiPrettier', 'text-gray-400'],
    
    // Testing
    'jest': [SiIcons, 'SiJest', 'text-red-600'],
    'cypress': [SiIcons, 'SiCypress', 'text-green-500'],
    'playwright': [SiIcons, 'SiPlaywright', 'text-green-600'],
    'selenium': [SiIcons, 'SiSelenium', 'text-green-500'],
    'vitest': [SiIcons, 'SiVitest', 'text-yellow-500'],
    
    // State Management
    'redux': [SiIcons, 'SiRedux', 'text-purple-500'],
    'mobx': [SiIcons, 'SiMobx', 'text-orange-500'],
    'zustand': [SiIcons, 'SiZustand', 'text-orange-600'],
    'recoil': [SiIcons, 'SiRecoil', 'text-blue-500'],
    
    // Mobile
    'flutter': [SiIcons, 'SiFlutter', 'text-blue-400'],
    'android': [SiIcons, 'SiAndroid', 'text-green-500'],
    'ios': [FaIcons, 'FaApple', 'text-white'],
    
    // Design
    'figma': [FaIcons, 'FaFigma', 'text-purple-500'],
    'sketch': [SiIcons, 'SiSketch', 'text-orange-500'],
    'photoshop': [SiIcons, 'SiAdobephotoshop', 'text-blue-600'],
    'illustrator': [SiIcons, 'SiAdobeillustrator', 'text-orange-600'],
    
    // APIs
    'graphql': [SiIcons, 'SiGraphql', 'text-pink-500'],
    'rest': [FaIcons, 'FaServer', 'text-green-500'],
    'restful': [FaIcons, 'FaServer', 'text-green-500'],
    'postman': [SiIcons, 'SiPostman', 'text-orange-500'],
    
    // CMS
    'wordpress': [SiIcons, 'SiWordpress', 'text-blue-600'],
    'shopify': [SiIcons, 'SiShopify', 'text-green-600'],
    
    // OS
    'linux': [FaIcons, 'FaLinux', 'text-yellow-400'],
  };
  
  // Try to find exact match first
  for (const [key, [library, iconName, color]] of Object.entries(iconMap)) {
    if (skillLower.includes(key)) {
      const icon = safeGetIcon(library, iconName, `${color} ${size}`);
      if (icon) return icon;
    }
  }
  
  // Smart category-based fallbacks for unknown skills
  // AI/ML/Data keywords
  if (skillLower.includes('learning') || skillLower.includes('neural') || 
      skillLower.includes('model') || skillLower.includes('train')) {
    return <FaIcons.FaBrain className={`text-purple-500 ${size}`} />;
  }
  
  // Data/Analytics keywords
  if (skillLower.includes('data') || skillLower.includes('analytics') || 
      skillLower.includes('visualization') || skillLower.includes('chart') ||
      skillLower.includes('plot') || skillLower.includes('graph')) {
    return <FaIcons.FaChartLine className={`text-blue-500 ${size}`} />;
  }
  
  // Database keywords
  if (skillLower.includes('db') || skillLower.includes('database') || 
      skillLower.includes('sql') || skillLower.includes('query')) {
    return <FaIcons.FaDatabase className={`text-purple-400 ${size}`} />;
  }
  
  // Cloud/DevOps keywords
  if (skillLower.includes('cloud') || skillLower.includes('deploy') || 
      skillLower.includes('ci') || skillLower.includes('cd') ||
      skillLower.includes('pipeline') || skillLower.includes('container')) {
    return <FaIcons.FaServer className={`text-blue-400 ${size}`} />;
  }
  
  // Testing keywords
  if (skillLower.includes('test') || skillLower.includes('qa') || 
      skillLower.includes('quality')) {
    return <FaIcons.FaCheckCircle className={`text-green-500 ${size}`} />;
  }
  
  // Design keywords
  if (skillLower.includes('design') || skillLower.includes('ui') || 
      skillLower.includes('ux') || skillLower.includes('prototype')) {
    return <FaIcons.FaPaintBrush className={`text-pink-500 ${size}`} />;
  }
  
  // Mobile keywords
  if (skillLower.includes('mobile') || skillLower.includes('app')) {
    return <FaIcons.FaMobile className={`text-teal-500 ${size}`} />;
  }
  
  // Security keywords
  if (skillLower.includes('security') || skillLower.includes('auth') || 
      skillLower.includes('encryption') || skillLower.includes('secure')) {
    return <FaIcons.FaLock className={`text-red-500 ${size}`} />;
  }
  
  // API/Backend keywords
  if (skillLower.includes('api') || skillLower.includes('backend') || 
      skillLower.includes('server')) {
    return <FaIcons.FaServer className={`text-green-500 ${size}`} />;
  }
  
  // Default fallback - generic code icon
  return <FaCode className={`text-gray-400 ${size}`} />;
};

export default getSkillIcon;
