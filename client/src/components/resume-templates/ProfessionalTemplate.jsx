export default function ProfessionalTemplate({ resumeData }) {
  return (
    <>
      <style>{`
        .professional-resume {
          width: 210mm;
          min-height: 297mm;
          padding: 19mm;
          font-family: Calibri, Arial, sans-serif;
          color: #000000;
          font-size: 11pt;
          line-height: 1.15;
          background: white;
        }
        .professional-name {
          font-size: 20pt;
          font-weight: bold;
          color: #000000;
          margin-bottom: 6px;
          text-align: center;
        }
        .professional-contact {
          font-size: 11pt;
          color: #000000;
          line-height: 1.15;
          margin-bottom: 4px;
          text-align: center;
        }
        .professional-links {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 12px;
        }
        .professional-link {
          color: #0066cc;
          text-decoration: underline;
        }
        .professional-header {
          text-align: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 2px solid #000000;
        }
        .professional-section {
          margin-bottom: 14px;
        }
        .professional-section-title {
          font-size: 14pt;
          font-weight: bold;
          color: #000000;
          margin-bottom: 6px;
          padding-bottom: 3px;
          border-bottom: 1px solid #000000;
          text-transform: uppercase;
        }
        .professional-text {
          font-size: 11pt;
          color: #000000;
          line-height: 1.15;
          margin-top: 6px;
          text-align: justify;
        }
        .professional-job-title {
          font-size: 12pt;
          font-weight: bold;
          color: #000000;
        }
        .professional-date {
          font-size: 11pt;
          color: #000000;
          white-space: nowrap;
          margin-left: 10px;
        }
        .professional-list {
          margin: 4px 0 0 20px;
          padding: 0;
          list-style-type: disc;
        }
        .professional-list-item {
          font-size: 11pt;
          color: #000000;
          line-height: 1.15;
          margin-bottom: 4px;
          text-align: justify;
        }
      `}</style>
      
      <div className="professional-resume" data-resume-preview>
        {/* Header */}
        {resumeData.personalInfo?.fullName && (
          <div className="professional-header">
            <h1 className="professional-name">
              {resumeData.personalInfo.fullName.toUpperCase()}
            </h1>
            <div className="professional-contact">
              {[
                resumeData.personalInfo.email,
                resumeData.personalInfo.phone,
                resumeData.personalInfo.location
              ].filter(Boolean).join(' | ')}
            </div>
            {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github || resumeData.personalInfo.website) && (
              <div className="professional-links">
                {resumeData.personalInfo.linkedin && (
                  <a href={resumeData.personalInfo.linkedin} className="professional-link">
                    LinkedIn
                  </a>
                )}
                {resumeData.personalInfo.github && (
                  <a href={resumeData.personalInfo.github} className="professional-link">
                    GitHub
                  </a>
                )}
                {resumeData.personalInfo.website && (
                  <a href={resumeData.personalInfo.website} className="professional-link">
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Professional Summary */}
        {resumeData.summary && (
          <div className="professional-section">
            <h2 className="professional-section-title">Professional Summary</h2>
            <p className="professional-text">{resumeData.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && resumeData.experience[0]?.company && (
          <div className="professional-section">
            <h2 className="professional-section-title">Work Experience</h2>
            {resumeData.experience.map((exp, index) => (
              exp.company && (
                <div key={index} style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span className="professional-job-title">{exp.position}</span>
                    <span className="professional-date">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '11pt', color: '#000000', marginBottom: '4px' }}>
                    {exp.company}
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className="professional-list">
                      {exp.description.map((desc, i) => (
                        desc && <li key={i} className="professional-list-item">{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && resumeData.projects[0]?.name && (
          <div className="professional-section">
            <h2 className="professional-section-title">Projects</h2>
            {resumeData.projects.map((project, index) => (
              project.name && (
                <div key={index} style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <div className="professional-job-title" style={{ marginBottom: '4px' }}>
                    {project.name}
                  </div>
                  {project.description && (
                    <ul className="professional-list">
                      <li className="professional-list-item">{project.description}</li>
                    </ul>
                  )}
                  {project.technologies && (
                    <div style={{ fontSize: '11pt', color: '#000000', marginTop: '4px' }}>
                      <span style={{ fontWeight: 'bold' }}>Tech Stack: </span>
                      {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                    </div>
                  )}
                  {(project.link || project.github) && (
                    <div style={{ fontSize: '11pt', marginTop: '4px', display: 'flex', gap: '10px' }}>
                      {project.link && (
                        <a href={project.link} className="professional-link">Live Demo</a>
                      )}
                      {project.github && (
                        <a href={project.github} className="professional-link">GitHub</a>
                      )}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && resumeData.skills[0]?.items && (
          <div className="professional-section">
            <h2 className="professional-section-title">Skills</h2>
            <div style={{ marginTop: '6px' }}>
              {resumeData.skills.map((skillGroup, index) => {
                const skillsText = Array.isArray(skillGroup.items) 
                  ? skillGroup.items.join(', ') 
                  : skillGroup.items;
                
                const lines = skillsText?.split('\n').filter(line => line.trim());
                
                if (lines && lines.length > 0) {
                  return lines.map((line, lineIndex) => {
                    const categoryMatch = line.match(/^([^:]+):\s*(.+)$/);
                    
                    if (categoryMatch) {
                      return (
                        <div key={`${index}-${lineIndex}`} style={{ fontSize: '11pt', marginBottom: '4px', lineHeight: '1.15' }}>
                          <span style={{ fontWeight: 'bold', color: '#000000' }}>{categoryMatch[1]}: </span>
                          <span style={{ color: '#000000' }}>{categoryMatch[2]}</span>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={`${index}-${lineIndex}`} style={{ fontSize: '11pt', color: '#000000', marginBottom: '4px', lineHeight: '1.15' }}>
                        {line}
                      </div>
                    );
                  });
                }
                
                return null;
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && resumeData.education[0]?.institution && (
          <div className="professional-section">
            <h2 className="professional-section-title">Education</h2>
            {resumeData.education.map((edu, index) => (
              edu.institution && (
                <div key={index} style={{ marginTop: '10px', marginBottom: '8px' }}>
                  <div className="professional-job-title" style={{ marginBottom: '4px' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </div>
                  <div style={{ fontSize: '11pt', color: '#000000', marginBottom: '4px' }}>
                    {edu.institution}
                    {(edu.startDate || edu.endDate) && (
                      <span>, {edu.startDate}-{edu.endDate}</span>
                    )}
                  </div>
                  {edu.gpa && (
                    <div style={{ fontSize: '11pt', color: '#000000' }}>
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && resumeData.certifications[0]?.name && (
          <div className="professional-section">
            <h2 className="professional-section-title">Certifications</h2>
            {resumeData.certifications.map((cert, index) => (
              cert.name && (
                <div key={index} style={{ marginTop: '8px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '11pt', fontWeight: 'bold', color: '#000000', marginBottom: '2px' }}>
                    {cert.name} - {cert.issuer || ''}
                  </div>
                  {cert.date && (
                    <div style={{ fontSize: '11pt', color: '#000000', marginBottom: '2px' }}>
                      {cert.date}
                    </div>
                  )}
                  {cert.link && (
                    <div style={{ fontSize: '11pt' }}>
                      <a href={cert.link} className="professional-link">View Certificate</a>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </>
  );
}
