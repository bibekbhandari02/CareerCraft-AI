export default function ExecutiveTemplate({ resumeData }) {
  return (
    <>
      <style>{`
        .executive-resume {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          font-family: 'Georgia', 'Times New Roman', serif;
          background: white;
          color: #000000;
        }
        .executive-inner {
          background: white;
          padding: 0;
        }
        .executive-header {
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 4px double #000000;
          margin-bottom: 18px;
        }
        .executive-name {
          font-size: 28pt;
          font-weight: 700;
          color: #000000;
          margin-bottom: 6px;
          letter-spacing: 1px;
        }
        .executive-title {
          font-size: 12pt;
          color: #000000;
          font-style: italic;
          margin-bottom: 10px;
        }
        .executive-contact {
          font-size: 10pt;
          color: #000000;
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        .executive-section {
          margin-bottom: 16px;
        }
        .executive-section-title {
          font-size: 13pt;
          font-weight: 700;
          color: #000000;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-bottom: 2px solid #000000;
          padding-bottom: 4px;
        }
        .executive-text {
          font-size: 11pt;
          line-height: 1.4;
          color: #000000;
          text-align: justify;
        }
        .executive-item-title {
          font-size: 12pt;
          font-weight: 700;
          color: #000000;
        }
        .executive-item-subtitle {
          font-size: 11pt;
          color: #000000;
          font-weight: 600;
        }
        .executive-date {
          font-size: 10pt;
          color: #000000;
        }
        .executive-list {
          margin: 6px 0 0 20px;
          padding: 0;
        }
        .executive-list-item {
          font-size: 11pt;
          color: #000000;
          line-height: 1.4;
          margin-bottom: 4px;
        }
        .executive-link {
          color: #000000;
          text-decoration: underline;
        }
        .executive-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
      `}</style>
      
      <div className="executive-resume" data-resume-preview>
        <div className="executive-inner">
          {/* Header */}
          {resumeData.personalInfo?.fullName && (
            <div className="executive-header">
              <h1 className="executive-name">{resumeData.personalInfo.fullName}</h1>
              <div className="executive-contact">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
              </div>
              {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github || resumeData.personalInfo.website) && (
                <div className="executive-contact" style={{ marginTop: '8px' }}>
                  {resumeData.personalInfo.linkedin && (
                    <a href={resumeData.personalInfo.linkedin} className="executive-link">
                      LinkedIn
                    </a>
                  )}
                  {resumeData.personalInfo.github && (
                    <a href={resumeData.personalInfo.github} className="executive-link">
                      GitHub
                    </a>
                  )}
                  {resumeData.personalInfo.website && (
                    <a href={resumeData.personalInfo.website} className="executive-link">
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Executive Summary */}
          {resumeData.summary && (
            <div className="executive-section">
              <h2 className="executive-section-title">Executive Summary</h2>
              <p className="executive-text">{resumeData.summary}</p>
            </div>
          )}

          {/* Professional Experience */}
          {resumeData.experience?.[0]?.company && (
            <div className="executive-section">
              <h2 className="executive-section-title">Professional Experience</h2>
              {resumeData.experience.map((exp, index) => (
                exp.company && (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <div className="executive-item-title">{exp.position}</div>
                      <div className="executive-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                    </div>
                    <div className="executive-item-subtitle" style={{ marginBottom: '6px' }}>{exp.company}</div>
                    {exp.description?.length > 0 && (
                      <ul className="executive-list">
                        {exp.description.map((desc, i) => desc && <li key={i} className="executive-list-item">{desc}</li>)}
                      </ul>
                    )}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Key Projects */}
          {resumeData.projects?.[0]?.name && (
            <div className="executive-section">
              <h2 className="executive-section-title">Key Projects</h2>
              {resumeData.projects.map((project, index) => (
                project.name && (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <div className="executive-item-title" style={{ marginBottom: '4px' }}>{project.name}</div>
                    {project.description && <p className="executive-text" style={{ marginBottom: '4px' }}>{project.description}</p>}
                    {project.technologies && (
                      <div className="executive-text" style={{ marginBottom: '4px' }}>
                        <strong>Tech Stack:</strong> {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                      </div>
                    )}
                    {(project.link || project.github) && (
                      <div style={{ fontSize: '10pt', display: 'flex', gap: '12px' }}>
                        {project.link && (
                          <a href={project.link} className="executive-link">
                            Live Demo
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} className="executive-link">
                            GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          )}

          <div className="executive-grid">
            {/* Core Competencies */}
            {resumeData.skills?.[0]?.items && (
              <div className="executive-section">
                <h2 className="executive-section-title" style={{ fontSize: '14pt' }}>Core Competencies</h2>
                <div>
                  {resumeData.skills.map((skillGroup, index) => {
                    const skillsText = Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items;
                    const lines = skillsText?.split('\n').filter(line => line.trim());
                    
                    return lines?.map((line, lineIndex) => {
                      const categoryMatch = line.match(/^([^:]+):\s*(.+)$/);
                      if (categoryMatch) {
                        return (
                          <div key={`${index}-${lineIndex}`} style={{ marginBottom: '8px' }}>
                            <div style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '10.5pt' }}>
                              {categoryMatch[1]}
                            </div>
                            <div className="executive-text" style={{ fontSize: '10pt' }}>{categoryMatch[2]}</div>
                          </div>
                        );
                      }
                      return <div key={`${index}-${lineIndex}`} className="executive-text" style={{ marginBottom: '4px', fontSize: '10pt' }}>{line}</div>;
                    });
                  })}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education?.[0]?.institution && (
              <div className="executive-section">
                <h2 className="executive-section-title" style={{ fontSize: '14pt' }}>Education</h2>
                {resumeData.education.map((edu, index) => (
                  edu.institution && (
                    <div key={index} style={{ marginBottom: '14px' }}>
                      <div className="executive-item-title" style={{ fontSize: '11.5pt' }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </div>
                      <div className="executive-item-subtitle" style={{ fontSize: '10.5pt' }}>{edu.institution}</div>
                      <div className="executive-date" style={{ fontSize: '9.5pt' }}>
                        {edu.startDate}–{edu.endDate}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          {resumeData.certifications?.[0]?.name && (
            <div className="executive-section">
              <h2 className="executive-section-title">Professional Certifications</h2>
              {resumeData.certifications.map((cert, index) => (
                cert.name && (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <span className="executive-item-title" style={{ fontSize: '11.5pt' }}>{cert.name}</span>
                    <span className="executive-item-subtitle"> — {cert.issuer}</span>
                    {cert.date && <span className="executive-date"> ({cert.date})</span>}
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
