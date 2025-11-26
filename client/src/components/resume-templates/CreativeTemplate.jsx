export default function CreativeTemplate({ resumeData }) {
  return (
    <>
      <style>{`
        .creative-resume {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          font-family: 'Poppins', sans-serif;
          background: white;
          color: #000000;
        }
        .creative-header {
          padding: 0 30px 16px;
          border-bottom: 3px solid #8b5cf6;
          margin-bottom: 18px;
        }
        .creative-name {
          font-size: 24pt;
          font-weight: 800;
          margin-bottom: 6px;
          color: #8b5cf6;
        }
        .creative-title {
          font-size: 12pt;
          font-weight: 400;
          margin-bottom: 8px;
          color: #000000;
        }
        .creative-contact {
          font-size: 10pt;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          color: #000000;
        }
        .creative-body {
          padding: 0;
        }
        .creative-section {
          margin-bottom: 14px;
        }
        .creative-section-title {
          font-size: 13pt;
          font-weight: 700;
          color: #8b5cf6;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .creative-text {
          font-size: 11pt;
          line-height: 1.3;
          color: #000000;
          text-align: justify;
        }
        .creative-item-title {
          font-size: 12pt;
          font-weight: 700;
          color: #000000;
        }
        .creative-item-subtitle {
          font-size: 11pt;
          color: #8b5cf6;
          font-weight: 600;
        }
        .creative-date {
          font-size: 10pt;
          color: #000000;
        }
        .creative-list {
          margin: 4px 0 0 20px;
          padding: 0;
        }
        .creative-list-item {
          font-size: 11pt;
          color: #000000;
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .creative-link {
          color: #8b5cf6;
          text-decoration: none;
          font-weight: 600;
        }

      `}</style>
      
      <div className="creative-resume" data-resume-preview>
        {/* Header */}
        {resumeData.personalInfo?.fullName && (
          <div className="creative-header">
            <h1 className="creative-name">{resumeData.personalInfo.fullName}</h1>
            <div className="creative-contact">
              {resumeData.personalInfo.email && <span>✉ {resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span>📱 {resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.location && <span>📍 {resumeData.personalInfo.location}</span>}
            </div>
            {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github) && (
              <div className="creative-contact" style={{ marginTop: '8px' }}>
                {resumeData.personalInfo.linkedin && (
                  <a href={resumeData.personalInfo.linkedin} className="creative-link">
                    LinkedIn
                  </a>
                )}
                {resumeData.personalInfo.github && (
                  <a href={resumeData.personalInfo.github} className="creative-link">
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        <div className="creative-body">
          {/* About */}
          {resumeData.summary && (
            <div className="creative-section">
              <h2 className="creative-section-title">✨ About Me</h2>
              <p className="creative-text">{resumeData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience?.[0]?.company && (
            <div className="creative-section">
              <h2 className="creative-section-title">💼 Experience</h2>
              {resumeData.experience.map((exp, index) => (
                exp.company && (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                      <div className="creative-item-title">{exp.position}</div>
                      <div className="creative-date">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                    </div>
                    <div className="creative-item-subtitle" style={{ marginBottom: '4px' }}>{exp.company}</div>
                    {exp.description?.length > 0 && (
                      <ul className="creative-list">
                        {exp.description.map((desc, i) => desc && <li key={i} className="creative-list-item">{desc}</li>)}
                      </ul>
                    )}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Projects */}
          {resumeData.projects?.[0]?.name && (
            <div className="creative-section">
              <h2 className="creative-section-title">🚀 Projects</h2>
              {resumeData.projects.map((project, index) => (
                project.name && (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <div className="creative-item-title" style={{ marginBottom: '3px' }}>{project.name}</div>
                    {project.description && <p className="creative-text" style={{ marginBottom: '4px' }}>{project.description}</p>}
                    {project.technologies && (
                      <div style={{ marginBottom: '8px' }}>
                        {(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',')).map((tech, i) => (
                          <span key={i} className="creative-skill-badge">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    {(project.link || project.github) && (
                      <div style={{ display: 'flex', gap: '15px', fontSize: '10pt' }}>
                        {project.link && <a href={project.link} className="creative-link">🌐 Live Demo</a>}
                        {project.github && <a href={project.github} className="creative-link">💻 GitHub</a>}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Skills */}
          {resumeData.skills?.[0]?.items && (
            <div className="creative-section">
              <h2 className="creative-section-title">⚡ Skills</h2>
              <div>
                {resumeData.skills.map((skillGroup, index) => {
                  const skillsText = Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items;
                  const lines = skillsText?.split('\n').filter(line => line.trim());
                  
                  return lines?.map((line, lineIndex) => {
                    const categoryMatch = line.match(/^([^:]+):\s*(.+)$/);
                    if (categoryMatch) {
                      return (
                        <div key={`${index}-${lineIndex}`} style={{ marginBottom: '4px', lineHeight: '1.3' }}>
                          <span style={{ fontWeight: '700', color: '#8b5cf6', fontSize: '11pt' }}>
                            {categoryMatch[1]}:{' '}
                          </span>
                          <span style={{ fontSize: '11pt', color: '#000000' }}>
                            {categoryMatch[2]}
                          </span>
                        </div>
                      );
                    }
                    return <div key={`${index}-${lineIndex}`} className="creative-text" style={{ marginBottom: '3px' }}>{line}</div>;
                  });
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education?.[0]?.institution && (
            <div className="creative-section">
              <h2 className="creative-section-title">🎓 Education</h2>
              {resumeData.education.map((edu, index) => (
                edu.institution && (
                  <div key={index} style={{ marginBottom: '14px' }}>
                    <div className="creative-item-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div className="creative-item-subtitle">{edu.institution}</div>
                    <div className="creative-date">
                      {edu.startDate}-{edu.endDate}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications?.[0]?.name && (
            <div className="creative-section">
              <h2 className="creative-section-title">🏆 Certifications</h2>
              {resumeData.certifications.map((cert, index) => (
                cert.name && (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <div className="creative-item-title">{cert.name}</div>
                    <div className="creative-item-subtitle">{cert.issuer}</div>
                    {cert.date && <div className="creative-date">{cert.date}</div>}
                    {cert.link && <a href={cert.link} className="creative-link" style={{ fontSize: '10pt' }}>View Certificate →</a>}
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
