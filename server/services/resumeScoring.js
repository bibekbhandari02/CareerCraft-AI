import { callGeminiAPI } from './ai.js';

// Industry-standard ATS scoring
export const calculateATSScore = (resumeData) => {
  let score = 0;
  const feedback = [];
  const suggestions = [];
  const criticalIssues = [];
  const warnings = [];

  // === CONTACT INFORMATION (10 points) ===
  let contactScore = 0;
  if (resumeData.personalInfo?.email) {
    contactScore += 4;
    feedback.push('✓ Email address included');
  } else {
    criticalIssues.push('Missing email address - recruiters cannot contact you');
  }
  
  if (resumeData.personalInfo?.phone) {
    contactScore += 3;
    feedback.push('✓ Phone number included');
  } else {
    criticalIssues.push('Missing phone number');
  }
  
  if (resumeData.personalInfo?.location) {
    contactScore += 3;
    feedback.push('✓ Location included');
  } else {
    warnings.push('Add your location (city, state) for better local job matches');
  }
  score += contactScore;

  // === PROFESSIONAL SUMMARY (10 points) ===
  if (resumeData.summary) {
    const summaryLength = resumeData.summary.length;
    if (summaryLength >= 150 && summaryLength <= 300) {
      score += 10;
      feedback.push('✓ Professional summary is well-crafted (optimal length)');
    } else if (summaryLength >= 50) {
      score += 6;
      feedback.push('✓ Professional summary present');
      if (summaryLength < 150) {
        suggestions.push('Expand your summary to 150-300 characters for better impact');
      } else {
        suggestions.push('Shorten your summary to 150-300 characters for better readability');
      }
    } else {
      score += 3;
      warnings.push('Professional summary is too short - expand to at least 150 characters');
    }
  } else {
    criticalIssues.push('Missing professional summary - add a compelling 2-3 sentence overview');
  }

  // === WORK EXPERIENCE (30 points) - Most important for ATS ===
  const hasExperience = resumeData.experience && resumeData.experience.length > 0;
  const isFresher = !hasExperience;
  
  if (hasExperience) {
    const expCount = resumeData.experience.length;
    
    // Points for having experience
    if (expCount >= 3) {
      score += 12;
      feedback.push(`✓ ${expCount} work experiences listed - excellent depth`);
    } else if (expCount >= 2) {
      score += 10;
      feedback.push(`✓ ${expCount} work experiences listed`);
      suggestions.push('Add more relevant experience if available');
    } else {
      score += 7;
      feedback.push(`✓ ${expCount} work experience listed`);
      suggestions.push('Add at least 2-3 relevant work experiences');
    }
    
    // Check for bullet points and quantifiable achievements
    let hasBullets = false;
    let hasQuantifiableResults = false;
    let hasActionVerbs = false;
    let bulletCount = 0;
    
    // ATS-friendly action verbs
    const actionVerbs = /\b(built|developed|created|designed|implemented|optimized|reduced|increased|improved|led|managed|achieved|delivered|launched|integrated|automated|streamlined|enhanced|collaborated|spearheaded)\b/i;
    
    resumeData.experience.forEach(exp => {
      if (Array.isArray(exp.description) && exp.description.length > 0) {
        hasBullets = true;
        bulletCount += exp.description.length;
        
        exp.description.forEach(desc => {
          // Check for numbers/percentages/metrics
          if (/\d+/.test(desc) || /%/.test(desc) || /\$/.test(desc)) {
            hasQuantifiableResults = true;
          }
          // Check for action verbs
          if (actionVerbs.test(desc)) {
            hasActionVerbs = true;
          }
        });
      }
    });
    
    if (hasBullets) {
      score += 10;
      feedback.push(`✓ Experience uses bullet points (${bulletCount} total) - ATS friendly`);
      
      if (bulletCount < expCount * 3) {
        suggestions.push(`Add more bullet points - aim for 3-5 per role (currently ${Math.round(bulletCount/expCount)} per role)`);
      }
    } else {
      criticalIssues.push('Use bullet points to describe your achievements in each role (3-5 bullets per role)');
    }
    
    if (hasActionVerbs) {
      feedback.push('✓ Uses strong action verbs - excellent!');
    } else {
      warnings.push('Start bullets with action verbs (e.g., Built, Developed, Optimized, Reduced, Increased)');
    }
    
    if (hasQuantifiableResults) {
      score += 8;
      feedback.push('✓ Includes quantifiable achievements with metrics - excellent!');
    } else {
      warnings.push('Add numbers/metrics to quantify impact (e.g., "Reduced load time by 40%", "Built platform serving 1000+ users")');
    }
  } else {
    // Fresher - no experience penalty, but need strong projects
    warnings.push('No work experience listed - ensure you have strong projects to compensate');
  }

  // === EDUCATION (12 points) ===
  if (resumeData.education && resumeData.education.length > 0) {
    score += 10;
    feedback.push(`✓ ${resumeData.education.length} education entry/entries`);
    
    // Check for GPA or achievements
    const hasGPA = resumeData.education.some(edu => edu.gpa);
    if (hasGPA) {
      score += 2;
      feedback.push('✓ GPA included - shows academic performance');
    }
  } else {
    criticalIssues.push('Missing education section - add your degree and institution');
  }

  // === SKILLS (18 points) - Critical for ATS keyword matching ===
  if (resumeData.skills && resumeData.skills.length > 0) {
    const totalSkills = resumeData.skills.reduce((sum, cat) => 
      sum + (cat.items?.length || 0), 0
    );
    
    const categories = resumeData.skills.length;
    const allSkills = resumeData.skills.flatMap(cat => cat.items || []).join(' ').toLowerCase();
    
    // Check for key skill categories
    const hasHardSkills = /react|node|javascript|python|java|mongodb|sql|html|css|express|api/.test(allSkills);
    const hasSoftSkills = /communication|teamwork|problem|leadership|collaboration|time management/.test(allSkills);
    const hasTools = /git|github|vscode|postman|docker|aws|vercel|render/.test(allSkills);
    
    if (totalSkills >= 15) {
      score += 18;
      feedback.push(`✓ ${totalSkills} skills across ${categories} categories - excellent keyword coverage`);
    } else if (totalSkills >= 10) {
      score += 14;
      feedback.push(`✓ ${totalSkills} skills listed`);
      suggestions.push(`Add ${15 - totalSkills} more relevant skills for better ATS matching`);
    } else if (totalSkills >= 5) {
      score += 9;
      feedback.push(`✓ ${totalSkills} skills listed`);
      warnings.push(`Add at least ${10 - totalSkills} more skills - aim for 15+ for optimal ATS performance`);
    } else {
      score += 4;
      warnings.push(`Only ${totalSkills} skills listed - add at least ${10 - totalSkills} more relevant skills`);
    }
    
    // Check for skill diversity
    if (!hasHardSkills) {
      warnings.push('Add technical/hard skills (e.g., React.js, Node.js, MongoDB, JavaScript)');
    }
    if (!hasSoftSkills) {
      suggestions.push('Include soft skills (e.g., Problem-solving, Team collaboration, Communication)');
    }
    if (!hasTools) {
      suggestions.push('List tools you use (e.g., Git, VS Code, Postman, Docker)');
    }
    
    // Check for skill categories
    if (categories < 3) {
      warnings.push('Organize skills into at least 3 categories: Technical Skills, Soft Skills, Tools & Technologies');
    } else {
      feedback.push(`✓ Skills organized into ${categories} categories - ATS friendly`);
    }
  } else {
    criticalIssues.push('Missing skills section - add 15+ skills in categories: Technical, Soft Skills, Tools');
  }

  // === PROJECTS (15 points) - Critical for freshers ===
  if (resumeData.projects && resumeData.projects.length > 0) {
    const projectCount = resumeData.projects.length;
    
    if (projectCount >= 3) {
      score += 15;
      feedback.push(`✓ ${projectCount} projects listed - excellent portfolio`);
    } else if (projectCount >= 2) {
      score += 10;
      feedback.push(`✓ ${projectCount} projects listed`);
      if (isFresher) {
        suggestions.push('Add 1 more project to strengthen your portfolio (aim for 3-4 projects)');
      }
    } else {
      score += 5;
      feedback.push(`✓ ${projectCount} project listed`);
      if (isFresher) {
        warnings.push('Add at least 2 more projects - freshers need 3-4 strong projects');
      } else {
        suggestions.push('Add 1-2 more relevant projects to showcase your skills');
      }
    }
    
    // Check project descriptions and achievements
    const hasDetailedProjects = resumeData.projects.some(proj => 
      proj.description && proj.description.length > 100
    );
    
    // Check for achievement keywords in projects
    const projectText = resumeData.projects.map(p => p.description || '').join(' ').toLowerCase();
    const hasAchievements = /built|developed|created|integrated|implemented|optimized|reduced|increased|designed/.test(projectText);
    const hasMetrics = /\d+/.test(projectText) || /%/.test(projectText);
    const hasTechStack = resumeData.projects.some(p => p.technologies && p.technologies.length >= 3);
    
    if (hasDetailedProjects) {
      feedback.push('✓ Projects have detailed descriptions');
    } else {
      warnings.push('Expand project descriptions to 150+ characters - explain what you built, how, and the impact');
    }
    
    if (hasAchievements) {
      feedback.push('✓ Projects use action-oriented language');
    } else {
      suggestions.push('Start project descriptions with action verbs (Built, Developed, Created, Integrated)');
    }
    
    if (hasMetrics) {
      feedback.push('✓ Projects include measurable outcomes');
    } else {
      warnings.push('Add metrics to projects (e.g., "Serving 500+ users", "Reduced API calls by 30%")');
    }
    
    if (hasTechStack) {
      feedback.push('✓ Projects list technology stack - good for keyword matching');
    } else {
      suggestions.push('List 3-5 technologies used in each project (e.g., React, Node.js, MongoDB)');
    }
    
    // Check for links
    const hasLinks = resumeData.projects.some(proj => proj.liveLink || proj.githubLink);
    if (hasLinks) {
      feedback.push('✓ Project links included - allows verification');
    } else {
      suggestions.push('Add GitHub repository or live demo links to your projects');
    }
  } else {
    if (isFresher) {
      criticalIssues.push('No projects listed - freshers MUST have 3-4 strong projects to compensate for lack of experience');
    } else {
      suggestions.push('Add 2-3 relevant projects to showcase your technical skills');
    }
  }

  // === CERTIFICATIONS (5 points bonus) ===
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    const certCount = resumeData.certifications.length;
    if (certCount >= 3) {
      score += 5;
      feedback.push(`✓ ${certCount} certifications - shows continuous learning`);
    } else {
      score += 3;
      feedback.push(`✓ ${certCount} certification(s)`);
      suggestions.push('Add more relevant certifications to stand out');
    }
  } else {
    suggestions.push('Add relevant certifications to boost credibility');
  }

  // === CONTENT QUALITY CHECKS ===
  const contentLength = [
    resumeData.summary || '',
    JSON.stringify(resumeData.experience || []),
    JSON.stringify(resumeData.education || []),
    JSON.stringify(resumeData.projects || []),
    JSON.stringify(resumeData.skills || [])
  ].join('').length;
  
  if (contentLength < 1200) {
    warnings.push('Resume content is thin - add more details, achievements, and project descriptions');
  } else if (contentLength > 4500) {
    warnings.push('Resume might be too long - focus on most relevant and recent information (aim for 1-2 pages)');
  } else {
    feedback.push('✓ Resume length is optimal (1-2 pages)');
  }

  // === ATS KEYWORD DENSITY CHECK ===
  const allContent = [
    resumeData.summary || '',
    JSON.stringify(resumeData.experience || []),
    JSON.stringify(resumeData.projects || []),
    JSON.stringify(resumeData.skills || [])
  ].join(' ').toLowerCase();
  
  // Check for important ATS keywords
  const keywordCategories = {
    technical: ['javascript', 'react', 'node', 'mongodb', 'api', 'html', 'css', 'express', 'database'],
    action: ['built', 'developed', 'created', 'designed', 'implemented', 'optimized', 'reduced', 'increased'],
    competencies: ['full-stack', 'responsive', 'authentication', 'deployment', 'crud', 'integration']
  };
  
  let keywordScore = 0;
  let missingKeywords = [];
  
  Object.entries(keywordCategories).forEach(([category, keywords]) => {
    const foundKeywords = keywords.filter(kw => allContent.includes(kw));
    keywordScore += foundKeywords.length;
    
    if (foundKeywords.length < keywords.length / 2) {
      if (category === 'technical') {
        missingKeywords.push('Add more technical keywords (React.js, Node.js, MongoDB, REST APIs)');
      } else if (category === 'action') {
        missingKeywords.push('Use more action verbs (Built, Developed, Optimized, Implemented)');
      } else if (category === 'competencies') {
        missingKeywords.push('Include competencies (Full-stack development, API integration, CRUD operations)');
      }
    }
  });
  
  if (keywordScore >= 15) {
    feedback.push('✓ Strong ATS keyword density - good for automated screening');
  } else if (keywordScore >= 10) {
    suggestions.push('Add more industry-relevant keywords for better ATS matching');
  } else {
    warnings.push('Low keyword density - add more technical terms and action verbs');
  }
  
  missingKeywords.forEach(msg => suggestions.push(msg));

  // === DETERMINE RATING ===
  let rating, ratingMessage, ratingColor;
  
  if (score >= 85) {
    rating = 'Excellent';
    ratingMessage = 'ATS-optimized and highly competitive';
    ratingColor = 'green';
  } else if (score >= 70) {
    rating = 'Good';
    ratingMessage = 'Solid resume with room for improvement';
    ratingColor = 'blue';
  } else if (score >= 55) {
    rating = 'Fair';
    ratingMessage = 'Needs significant improvements';
    ratingColor = 'yellow';
  } else if (score >= 40) {
    rating = 'Poor';
    ratingMessage = 'Multiple critical issues to address';
    ratingColor = 'orange';
  } else {
    rating = 'Very Poor';
    ratingMessage = 'Major sections missing - not ready for submission';
    ratingColor = 'red';
  }

  // === CONTEXTUAL ADVICE ===
  let contextualSummary = '';
  if (isFresher) {
    if (score < 70) {
      contextualSummary = 'As a fresher, focus on: (1) Adding 3-4 detailed projects, (2) Listing 15+ relevant skills, (3) Quantifying project impact with metrics.';
    } else {
      contextualSummary = 'Strong foundation for a fresher. Continue adding projects and certifications to stand out.';
    }
  } else {
    if (score < 70) {
      contextualSummary = 'Focus on: (1) Adding quantifiable achievements to experience, (2) Expanding skills section, (3) Including 2-3 relevant projects.';
    } else {
      contextualSummary = 'Well-structured resume. Fine-tune with more metrics and keywords for specific job descriptions.';
    }
  }

  return {
    score: Math.min(score, 100),
    rating,
    ratingMessage,
    ratingColor,
    contextualSummary,
    feedback,
    suggestions,
    criticalIssues,
    warnings,
    breakdown: {
      contactInfo: contactScore,
      summary: resumeData.summary ? 10 : 0,
      experience: hasExperience ? 30 : 0,
      education: resumeData.education?.length > 0 ? 12 : 0,
      skills: resumeData.skills?.length > 0 ? 18 : 0,
      projects: resumeData.projects?.length > 0 ? 15 : 0,
      certifications: resumeData.certifications?.length > 0 ? 5 : 0
    }
  };
};

// AI-powered resume scoring with detailed feedback
export const scoreResumeWithAI = async (resumeData, jobDescription = '') => {
  const basicScore = calculateATSScore(resumeData);
  
  const prompt = `You are an expert ATS (Applicant Tracking System) and resume reviewer.

Analyze this resume and provide detailed scoring and feedback.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `Target Job Description:\n${jobDescription}\n` : ''}

Provide a JSON response with:
{
  "atsCompatibility": {
    "score": 0-100,
    "issues": ["list of ATS compatibility issues"],
    "strengths": ["list of ATS-friendly elements"]
  },
  "contentQuality": {
    "score": 0-100,
    "strengths": ["what's done well"],
    "improvements": ["specific improvements needed"]
  },
  "keywordOptimization": {
    "score": 0-100,
    "missingKeywords": ["important keywords to add"],
    "presentKeywords": ["good keywords already present"]
  },
  ${jobDescription ? `"jobMatch": {
    "score": 0-100,
    "matchingSkills": ["skills that match job"],
    "missingSkills": ["skills needed for job"],
    "relevanceNotes": "how well resume matches job"
  },` : ''}
  "overallScore": 0-100,
  "topPriorities": ["3 most important things to fix"],
  "summary": "2-3 sentence overall assessment"
}

Be specific and actionable in your feedback.`;

  try {
    const aiResponse = await callGeminiAPI(prompt);
    const cleanedResponse = aiResponse.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '');
    
    const aiScore = JSON.parse(cleanedResponse);
    
    return {
      basic: basicScore,
      ai: aiScore,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('AI scoring error:', error);
    // Return basic score if AI fails
    return {
      basic: basicScore,
      ai: null,
      error: 'AI scoring unavailable',
      timestamp: new Date()
    };
  }
};
