import fetch from 'node-fetch';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

// Helper function to call Gemini API
async function callGeminiAPI(prompt) {
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

  try {
    console.log('🤖 Calling Gemini API...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('✅ Gemini API response received');
    
    return generatedText;
    
  } catch (error) {
    console.error('❌ Gemini API call failed:', error.message);
    throw error;
  }
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

export const generateCoverLetter = async (jobTitle, resumeData) => {
  const prompt = `You are a professional cover letter writer.

Write a professional cover letter for the position: ${jobTitle}.

Use the following resume data and customize it to match the role.

Resume: ${JSON.stringify(resumeData)}

Keep it:
- 3 short paragraphs
- Personalized
- ATS friendly`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position. With my background in ${resumeData.experience?.[0]?.position || 'software development'} and proven track record of success, I am confident I would be a valuable addition to your team.

In my current role at ${resumeData.experience?.[0]?.company || 'my current company'}, I have successfully delivered multiple projects and consistently exceeded expectations. My technical skills combined with my problem-solving abilities make me an ideal candidate for this position.

I am excited about the opportunity to contribute to your organization and would welcome the chance to discuss how my skills and experience align with your needs.

Sincerely,
${resumeData.personalInfo?.fullName || 'Your Name'}`;
    }
    throw error;
  }
};

export const generatePortfolioContent = async (userData) => {
  const prompt = `You are a portfolio content writer.

Generate a portfolio website content including:
- Hero title
- About me
- Skills
- Projects (summaries)
- Contact section

User Data: ${JSON.stringify(userData)}`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return JSON.stringify({
        hero: 'Full Stack Developer',
        about: 'Passionate developer with expertise in modern web technologies',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        projects: ['E-commerce Platform', 'Social Media App', 'Portfolio Website']
      });
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
