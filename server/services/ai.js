import fetch from 'node-fetch';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

// Helper function to call Gemini API with retry logic
async function callGeminiAPI(prompt, options = {}) {
  const { maxRetries = 2, timeout = 30000 } = options;
  
  // Get API key at runtime (after dotenv has loaded)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment');
    throw new Error('GEMINI_API_KEY not configured');
  }

  console.log('✅ Using Gemini API key:', GEMINI_API_KEY.substring(0, 20) + '...');
  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  
  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`🔄 Retry attempt ${attempt}/${maxRetries}...`);
        // Exponential backoff: wait 1s, 2s, 4s...
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
      }
      
      console.log('🤖 Calling Gemini API...');
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        
        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
        }
        
        // Retry on server errors (5xx)
        lastError = new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
        continue;
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('✅ Gemini API response received');
      
      return generatedText;
      
    } catch (error) {
      console.error(`❌ Gemini API call failed (attempt ${attempt + 1}):`, error.message);
      lastError = error;
      
      // Don't retry on abort/timeout or client errors
      if (error.name === 'AbortError' || error.message.includes('Gemini API error:')) {
        throw error;
      }
    }
  }
  
  throw lastError || new Error('Failed to generate content after retries');
}

export const enhanceResume = async (resumeData) => {
  const hasExperience = resumeData.experience?.[0]?.company;
  const hasProjects = resumeData.projects?.[0]?.name;
  
  const prompt = `You are an expert resume writer specializing in ATS-friendly formatting.
Your task is to create compelling resume content using action-oriented bullet points with strong verbs, 
quantified results, and job-specific keywords. Ensure the final output is clean, concise, 
and optimized for Applicant Tracking Systems.

${!hasExperience ? 'NOTE: This is a FRESHER/STUDENT resume with NO work experience. Focus heavily on projects, skills, education, and potential.' : ''}

Resume Data:
Personal Info: ${JSON.stringify(resumeData.personalInfo)}
Education: ${JSON.stringify(resumeData.education)}
${hasExperience ? `Work Experience: ${JSON.stringify(resumeData.experience)}` : 'Work Experience: None (Fresher/Student)'}
${hasProjects ? `Projects: ${JSON.stringify(resumeData.projects)}` : ''}
Skills: ${JSON.stringify(resumeData.skills)}
Certifications: ${JSON.stringify(resumeData.certifications || [])}

Return in this EXACT format with clear section headers:

**Summary**
[Professional summary here - ${!hasExperience ? 'emphasize skills, education, and eagerness to learn' : 'highlight experience and achievements'}]

${hasExperience ? `**Experience**
[Enhanced bullet points for work experience, each starting with *]
* [Bullet point 1]
* [Bullet point 2]
* [Bullet point 3]` : ''}

**Skills**
[Organize skills by category, one per line]
Frontend: [list]
Backend: [list]
Tools: [list]

${hasProjects ? `**Projects**
Project: [Enhanced project name]
Description: [Enhanced description with impact and results]
Technologies: [comma-separated list like: React, Node.js, MongoDB]
${resumeData.projects?.[0]?.github ? 'GitHub: [URL if available]' : ''}
${resumeData.projects?.[0]?.link ? 'Live: [URL if available]' : ''}` : `**Projects**
[Suggest 2-3 project ideas they could add based on their skills]
For each project include:
Project: [Name]
Description: [What it does and impact]
Technologies: [Suggested tech stack]`}

**Education**
[Any enhancements like GPA, achievements, relevant coursework]

${!hasExperience ? '**Tips for Freshers**\n[Specific advice to stand out]' : ''}`;

  try {
    const result = await callGeminiAPI(prompt);
    console.log('✅ Real Gemini AI response used');
    return result;
  } catch (error) {
    console.error('❌ Gemini API Error Details:', error);
    // Fallback to mock response in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️ Using mock AI response (development mode)');
      return getMockResumeEnhancement(resumeData);
    }
    throw error;
  }
};

export const generateCoverLetter = async (jobTitle, resumeData, companyName = '', hiringManager = '', customPrompt = '') => {
  const companyText = companyName ? ` at ${companyName}` : '';
  const greeting = 'Dear Hiring Manager';
  
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Extract contact info from resume - handle different field names
  const personalInfo = resumeData.personalInfo || {};
  const fullName = personalInfo.fullName || personalInfo.name || '[Your Name]';
  const phone = personalInfo.phone || personalInfo.phoneNumber || personalInfo.mobile || '[Phone Number]';
  const email = personalInfo.email || personalInfo.emailAddress || '[Email Address]';
  const location = personalInfo.location || personalInfo.address || personalInfo.city || '[Location]';
  const linkedin = personalInfo.linkedin || personalInfo.linkedinUrl || '';
  const github = personalInfo.github || personalInfo.githubUrl || '';
  
  // Check if user wants to remove date
  const includeDate = !customPrompt?.toLowerCase().includes('remove the date') && 
                      !customPrompt?.toLowerCase().includes('without date') &&
                      !customPrompt?.toLowerCase().includes('no date');
  
  // Build header
  let header = `${fullName}\n${phone} | ${email}\n${location}`;
  if (linkedin || github) {
    if (linkedin) header += `\nLinkedIn: ${linkedin}`;
    if (github) header += `\nGitHub: ${github}`;
  }
  
  // Add date if not explicitly removed
  if (includeDate) {
    header += `\n\n${currentDate}\n\n`;
  } else {
    header += `\n\n`;
  }
  
  // Add recipient info if available
  if (hiringManager || companyName) {
    if (hiringManager) header += `${hiringManager}\n`;
    if (companyName) header += `${companyName}\n`;
    header += '\n';
  }
  
  // Determine paragraph count from custom prompt or use default
  let paragraphInstruction = 'Write 3 concise, impactful paragraphs';
  if (customPrompt) {
    if (customPrompt.toLowerCase().includes('2 paragraph')) {
      paragraphInstruction = 'Write 2 concise, impactful paragraphs';
    } else if (customPrompt.toLowerCase().includes('1 paragraph')) {
      paragraphInstruction = 'Write 1 concise, impactful paragraph';
    } else if (customPrompt.toLowerCase().includes('4 paragraph')) {
      paragraphInstruction = 'Write 4 concise, impactful paragraphs';
    }
  }
  
  // Create a condensed version of resume data to reduce token usage
  const condensedResume = {
    name: fullName,
    experience: resumeData.experience?.slice(0, 2).map(exp => ({
      position: exp.position,
      company: exp.company,
      description: exp.description?.substring(0, 200) // Limit description length
    })),
    skills: resumeData.skills?.slice(0, 3).map(s => s.items?.join(', ')).join('; '),
    education: resumeData.education?.[0] ? {
      degree: resumeData.education[0].degree,
      institution: resumeData.education[0].institution
    } : null
  };
  
  const prompt = `You are a professional cover letter writer.

Write a professional cover letter for the position: ${jobTitle}${companyText}.

Candidate Background:
- Name: ${condensedResume.name}
- Recent Experience: ${JSON.stringify(condensedResume.experience)}
- Key Skills: ${condensedResume.skills}
- Education: ${JSON.stringify(condensedResume.education)}

${customPrompt ? `\nUSER'S CUSTOM INSTRUCTIONS (PRIORITY):\n${customPrompt}\n\nFollow these custom instructions carefully while maintaining professional quality.\n` : ''}

CRITICAL FORMAT REQUIREMENTS:
- DO NOT include any header information (name, contact, date, recipient name, etc.) - this will be added automatically
- You MUST start with EXACTLY this greeting: "Dear Hiring Manager,"
- DO NOT use any other greeting like "Dear [Name]," or "Dear Sir/Madam,"
- ${paragraphInstruction}
- IMPORTANT: Use actual line breaks (press Enter twice) between paragraphs, NOT the text "\\n"
- Add a blank line after the greeting
- Add a blank line before "Sincerely,"
- Be personalized and enthusiastic
- Make it ATS friendly
- Use professional tone
- Highlight relevant experience and skills
- End with "Sincerely," followed by ONLY the candidate's name (no contact info)

EXAMPLE FORMAT (with actual line breaks):
Dear Hiring Manager,

[First paragraph - write actual content here]

[Second paragraph - write actual content here]

[Third paragraph - write actual content here]

Sincerely,
${fullName}

IMPORTANT: 
1. Use EXACTLY "Dear Hiring Manager," as the greeting - no other variation
2. Use real line breaks in your response, not the literal text "\\n"
3. The letter should be ready to send - professional, polished, and compelling with proper paragraph spacing.`;

  try {
    let letterBody = await callGeminiAPI(prompt, { timeout: 30000, maxRetries: 2 });
    
    // Convert literal \n to actual line breaks if AI returned them as text
    letterBody = letterBody.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n');
    
    return `${header}${letterBody}`;
  } catch (error) {
    console.error('Cover letter generation failed:', error);
    
    // Provide fallback only in development
    if (process.env.NODE_ENV !== 'production') {
      const fallbackBody = `${greeting},

I am writing to express my strong interest in the ${jobTitle} position${companyText}. With my background in ${resumeData.experience?.[0]?.position || 'software development'} and proven track record of success, I am confident I would be a valuable addition to your team.

In my current role at ${resumeData.experience?.[0]?.company || 'my current company'}, I have successfully delivered multiple projects and consistently exceeded expectations. My technical skills combined with my problem-solving abilities make me an ideal candidate for this position.

I am excited about the opportunity to contribute to your organization and would welcome the chance to discuss how my skills and experience align with your needs.

Sincerely,
${fullName}`;
      
      return `${header}${fallbackBody}`;
    }
    throw error;
  }
};

export const generatePortfolioContent = async (userData, customPrompt = '') => {
  let prompt = `You are an expert portfolio content writer.

Generate professional portfolio content based on the user's information.`;

  if (customPrompt) {
    prompt += `\n\nUser's Request: "${customPrompt}"\n\nCurrent Data: ${JSON.stringify(userData)}\n\nGenerate content that fulfills their request while maintaining professional quality.`;
  } else {
    prompt += `\n\nUser Data: ${JSON.stringify(userData)}\n\nEnhance and improve their portfolio content.`;
  }

  prompt += `

Return ONLY a valid JSON object (no markdown, no code blocks) in this EXACT format:
{
  "hero": {
    "title": "Full Name",
    "subtitle": "Professional Title (e.g., Full Stack Developer, UI/UX Designer)",
    "description": "Compelling 2-3 sentence introduction highlighting expertise and passion"
  },
  "about": "A concise 2 paragraph about section. First paragraph: 2-3 sentences about background and expertise. Second paragraph: 2-3 sentences about passion and what drives them. Keep it professional and impactful.",
  "skills": [
    {
      "category": "Frontend Development",
      "items": ["React", "Vue.js", "TypeScript", "Tailwind CSS"]
    },
    {
      "category": "Backend Development",
      "items": ["Node.js", "Express", "MongoDB", "PostgreSQL"]
    },
    {
      "category": "Tools & Others",
      "items": ["Git", "Docker", "AWS", "CI/CD"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Concise description of the project (2-3 sentences max). Focus on key features and impact.",
      "technologies": ["React", "Node.js", "MongoDB"],
      "liveLink": "",
      "githubLink": ""
    }
  ]
}

Make the content:
- CONCISE and to the point (no long paragraphs)
- Professional yet personable
- Achievement-focused with specific examples
- Tailored to their field/industry
- Include 2-3 impressive project ideas if no projects provided`;

  try {
    const result = await callGeminiAPI(prompt);
    // Clean up the response - remove markdown code blocks if present
    let cleanedResult = result.trim();
    if (cleanedResult.startsWith('```json')) {
      cleanedResult = cleanedResult.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResult.startsWith('```')) {
      cleanedResult = cleanedResult.replace(/```\n?/g, '');
    }
    
    // Parse to validate JSON
    const parsed = JSON.parse(cleanedResult);
    return parsed;
  } catch (error) {
    console.error('Portfolio generation error:', error);
    if (process.env.NODE_ENV !== 'production') {
      return {
        hero: {
          title: userData?.content?.hero?.title || 'Your Name',
          subtitle: 'Full Stack Developer',
          description: 'Passionate developer with expertise in building modern web applications using cutting-edge technologies.'
        },
        about: 'Dedicated software developer specializing in full-stack web development. Experienced in building scalable applications with modern technologies and best practices. Strong foundation in both frontend and backend development.\n\nPassionate about creating elegant solutions to complex problems. Committed to writing clean, maintainable code and staying current with industry trends.',
        skills: [
          {
            category: 'Frontend Development',
            items: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Next.js']
          },
          {
            category: 'Backend Development',
            items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs']
          },
          {
            category: 'Tools & DevOps',
            items: ['Git', 'Docker', 'AWS', 'CI/CD', 'Jest']
          }
        ],
        projects: [
          {
            name: 'E-Commerce Platform',
            description: 'Full-featured online shopping platform with authentication, product management, and payment integration. Includes real-time inventory tracking.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
            liveLink: '',
            githubLink: ''
          },
          {
            name: 'Task Management App',
            description: 'Collaborative task management tool with real-time updates and drag-and-drop interface. Supports team collaboration and customizable workflows.',
            technologies: ['Vue.js', 'Firebase', 'Vuex', 'Tailwind CSS'],
            liveLink: '',
            githubLink: ''
          }
        ]
      };
    }
    throw error;
  }
};

// Mock response helper
function getMockResumeEnhancement(resumeData) {
  return `
**PROFESSIONAL SUMMARY**
Results-driven professional with expertise in ${resumeData.skills?.[0]?.items || 'various technologies'}. Proven track record of delivering high-quality solutions and exceeding expectations.

**WORK EXPERIENCE**

${resumeData.experience?.[0]?.company || 'Company Name'} - ${resumeData.experience?.[0]?.position || 'Position'}
• Spearheaded development initiatives resulting in 30% improvement in efficiency
• Collaborated with cross-functional teams to deliver projects on time and within budget
• Implemented best practices and coding standards across the organization
• Mentored junior team members and conducted code reviews

**KEY ACHIEVEMENTS**
• Increased productivity by 25% through process optimization
• Successfully delivered 10+ projects with 100% client satisfaction
• Reduced system downtime by 40% through proactive monitoring

**TECHNICAL SKILLS**
${resumeData.skills?.[0]?.items || 'JavaScript, React, Node.js, MongoDB, Git'}

*Note: This is an AI-enhanced version optimized for ATS systems*
`;
}

// Parse resume from uploaded file using AI
export const parseResumeFromFile = async (file) => {
  try {
    let extractedText = '';
    
    // Extract text based on file type
    if (file.mimetype === 'application/pdf') {
      // Parse PDF
      console.log('📄 Parsing PDF file...');
      const pdfData = await pdfParse(file.buffer);
      extractedText = pdfData.text;
      console.log('✅ PDF text extracted:', extractedText.substring(0, 200) + '...');
    } else if (file.mimetype.includes('word')) {
      // Parse Word document
      console.log('📝 Parsing Word document...');
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
      console.log('✅ Word text extracted:', extractedText.substring(0, 200) + '...');
    } else {
      throw new Error('Unsupported file type');
    }
    
    // Use AI to parse the extracted text into structured data
    const prompt = `You are a resume parser. Extract information from this resume text and return it as JSON.

Resume Text:
${extractedText}

Extract and return ONLY valid JSON in this exact format:
{
  "personalInfo": {
    "fullName": "extract full name",
    "email": "extract email",
    "phone": "extract phone number",
    "location": "extract location/address"
  },
  "summary": "extract professional summary or objective",
  "experience": [
    {
      "position": "job title",
      "company": "company name",
      "startDate": "start date",
      "endDate": "end date or Present",
      "description": "job responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "university/college name",
      "graduationDate": "graduation year"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"]
}

Return ONLY the JSON, no markdown or explanations.`;

    console.log('🤖 Parsing resume with AI...');
    const response = await callGeminiAPI(prompt);
    
    // Parse the JSON response
    let parsedData;
    try {
      const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanedResponse);
      console.log('✅ Resume parsed successfully:', parsedData.personalInfo?.fullName);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }
    
    return {
      ...parsedData,
      uploadedFile: true,
      fileName: file.originalname
    };
    
  } catch (error) {
    console.error('❌ Resume parsing error:', error);
    throw error;
  }
};
