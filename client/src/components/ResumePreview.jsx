export default function ResumePreview({ resumeData }) {
  if (!resumeData) return null;

  return (
    <div className="bg-white p-8 shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      {resumeData.personalInfo?.fullName && (
        <div className="mb-6 border-b-2 border-indigo-600 pb-4">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">
            {resumeData.personalInfo.fullName}
          </h1>
          <div className="text-sm text-gray-600 space-y-1">
            {resumeData.personalInfo.email && (
              <div>{resumeData.personalInfo.email}</div>
            )}
            {resumeData.personalInfo.phone && (
              <span>{resumeData.personalInfo.phone}</span>
            )}
            {resumeData.personalInfo.location && (
              <span> | {resumeData.personalInfo.location}</span>
            )}
            {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github) && (
              <div className="flex gap-4">
                {resumeData.personalInfo.linkedin && (
                  <a href={resumeData.personalInfo.linkedin} className="text-indigo-600 hover:underline">
                    LinkedIn
                  </a>
                )}
                {resumeData.personalInfo.github && (
                  <a href={resumeData.personalInfo.github} className="text-indigo-600 hover:underline">
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 text-sm">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && resumeData.experience[0]?.company && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300">
            WORK EXPERIENCE
          </h2>
          {resumeData.experience.map((exp, index) => (
            exp.company && (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{exp.position}</h3>
                    <p className="text-gray-600 text-sm">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    {exp.description.map((desc, i) => (
                      desc && <li key={i} className="ml-4">• {desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && resumeData.education[0]?.institution && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300">
            EDUCATION
          </h2>
          {resumeData.education.map((edu, index) => (
            edu.institution && (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && resumeData.skills[0]?.items && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300">
            SKILLS
          </h2>
          <div className="space-y-2">
            {resumeData.skills.map((skillGroup, index) => {
              // Parse skills if they contain categories (e.g., "Frontend: HTML, CSS")
              const skillsText = Array.isArray(skillGroup.items) 
                ? skillGroup.items.join(', ') 
                : skillGroup.items;
              
              // Check if skills contain category format
              const categoryMatch = skillsText?.match(/^([^:]+):\s*(.+)$/);
              
              if (categoryMatch) {
                return (
                  <div key={index} className="mb-2">
                    <span className="font-semibold text-gray-800">{categoryMatch[1]}: </span>
                    <span className="text-gray-700 text-sm">{categoryMatch[2]}</span>
                  </div>
                );
              }
              
              // If there's a category field, use it
              if (skillGroup.category) {
                return (
                  <div key={index} className="mb-2">
                    <span className="font-semibold text-gray-800">{skillGroup.category}: </span>
                    <span className="text-gray-700 text-sm">{skillsText}</span>
                  </div>
                );
              }
              
              // Otherwise, split by common patterns
              const skillLines = skillsText?.split(/(?:Frontend:|Backend:|Programming Languages:|Tools & Platforms:|Data Analysis)/i)
                .filter(line => line.trim());
              
              if (skillLines && skillLines.length > 1) {
                const categories = skillsText.match(/(?:Frontend|Backend|Programming Languages|Tools & Platforms|Data Analysis)[^:]*:/gi);
                return categories?.map((cat, i) => (
                  <div key={`${index}-${i}`} className="mb-2">
                    <span className="font-semibold text-gray-800">{cat} </span>
                    <span className="text-gray-700 text-sm">{skillLines[i]?.trim()}</span>
                  </div>
                ));
              }
              
              // Default: show as is
              return (
                <div key={index} className="mb-2">
                  <span className="text-gray-700 text-sm">{skillsText}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && resumeData.projects[0]?.name && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300">
            PROJECTS
          </h2>
          {resumeData.projects.map((project, index) => (
            project.name && (
              <div key={index} className="mb-3">
                <h3 className="font-bold text-gray-800">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Technologies: {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                  </p>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && resumeData.certifications[0]?.name && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300">
            CERTIFICATIONS
          </h2>
          {resumeData.certifications.map((cert, index) => (
            cert.name && (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{cert.name}</h3>
                    {cert.issuer && (
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                    )}
                    {cert.date && (
                      <p className="text-xs text-gray-500">{cert.date}</p>
                    )}
                    {cert.link && (
                      <a 
                        href={cert.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        View Certificate →
                      </a>
                    )}
                  </div>
                  {cert.imageUrl && (
                    <img 
                      src={cert.imageUrl} 
                      alt={cert.name}
                      className="w-24 h-24 object-cover rounded border ml-4"
                    />
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
