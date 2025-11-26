export default function TechnicalTemplate({ resumeData }) {
  return (
    <>
      <style>{`
        .technical-resume {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          background: #0d1117;
          color: #c9d1d9;
        }
        .technical-header {
          border: 2px solid #30363d;
          padding: 16px;
          margin-bottom: 18px;
          background: #161b22;
        }
        .technical-name {
          font-size: 24pt;
          font-weight: 700;
          color: #58a6ff;
          margin-bottom: 6px;
          font-family: 'Courier New', monospace;
        }
        .technical-prompt {
          color: #7ee787;
          font-size: 10pt;
        }
        .technical-contact {
          font-size: 10pt;
          color: #8b949e;
          margin-top: 8px;
        }
        .technical-section {
          margin-bottom: 16px;
          border-left: 3px solid #30363d;
          padding-left: 12px;
        }
        .technical-section-title {
          font-size: 12pt;
          font-weight: 700;
          color: #7ee787;
          margin-bottom: 8px;
          font-family: 'Courier New', monospace;
        }
        .technical-section-title:before {
          content: "$ ";
          color: #58a6ff;
        }
        .technical-text {
          font-size: 10.5pt;
          line-height: 1.4;
          color: #c9d1d9;
          text-align: justify;
        }
        .technical-item-title {
          font-size: 11pt;
          font-weight: 700;
          color: #f0883e;
        }
        .technical-item-subtitle {
          font-size: 10.5pt;
          color: #58a6ff;
          font-weight: 600;
        }
        .technical-date {
          font-size: 10pt;
          color: #8b949e;
        }
        .technical-list {
          margin: 6px 0 0 20px;
          padding: 0;
          list-style-type: none;
        }
        .technical-list-item {
          font-size: 10.5pt;
          color: #c9d1d9;
          line-height: 1.4;
          margin-bottom: 4px;
          position: relative;
          padding-left: 16px;
        }
        .technical-list-item:before {
          content: ">";
          position: absolute;
          left: 0;
          color: #7ee787;
        }
        .technical-link {
          color: #58a6ff;
          text-decoration: none;
        }
        .technical-tag {
          display: inline-block;
          padding: 3px 10px;
          background: #1f6feb;
          color: #ffffff;
          border-radius: 4px;
          font-size: 9.5pt;
          margin: 3px 4px 3px 0;
          font-family: 'Courier New', monospace;
        }
        .technical-comment {
          color: #8b949e;
          font-style: italic;
        }
      `}</style>
      
      <div className="technical-resume" data-resume-preview>
        {/* Header */}
        {resumeData.personalInfo?.fullName && (
          <div className="technical-header">
            <div className="technical-prompt">developer@resume:~$</div>
            <h1 className="technical-name">{resumeData.personalInfo.fullName}</h1>
            <div className="technical-contact">
              {resumeData.personalInfo.email && <div>📧 {resumeData.personalInfo.email}</div>}
              {resumeData.personalInfo.phone && <div>📱 {resumeData.personalInfo.phone}</div>}
              {resumeData.personalInfo.location && <div>📍 {resumeData.personalInfo.location}</div>}
              {resumeData.personalInfo.linkedin && (
                <div>
                  🔗 LinkedIn: <a href={resumeData.personalInfo.linkedin} className="technical-link">{resumeData.personalInfo.linkedin}</a>
                </div>
              )}
              {resumeData.personalInfo.github && (
                <div>
                  💻 GitHub: <a href={resumeData.personalInfo.github} className="technical-link">{resumeData.personalInfo.github}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* About */}
        {resumeData.summary && (
          <div className="technical-section">
            <h2 className="technical-section-title">cat about.txt</h2>
            <p className="technical-text">{resumeData.summary}</p>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills?.[0]?.items && (
          <div className="technical-section">
            <h2 className="technical-section-title">ls skills/</h2>
            <div>
              {resumeData.skills.map((skillGroup, index) => {
                const skillsText = Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items;
                const lines = skillsText?.split('\n').filter(line => line.trim());
                
                return lines?.map((line, lineIndex) => {
                  const categoryMatch = line.match(/^([^:]+):\s*(.+)$/);
                  if (categoryMatch) {
                    return (
                      <div key={`${index}-${lineIndex}`} style={{ marginBottom: '4px', lineHeight: '1.3' }}>
                        <span style={{ color: '#f0883e', fontSize: '10.5pt', fontWeight: '700' }}>
                          # {categoryMatch[1]}:{' '}
                        </span>
                        <span style={{ fontSize: '10.5pt', color: '#c9d1d9' }}>
                          {categoryMatch[2]}
                        </span>
                      </div>
                    );
                  }
                  return <div key={`${index}-${lineIndex}`} className="technical-text" style={{ marginBottom: '3px' }}>{line}</div>;
                });
              })}
            </div>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience?.[0]?.company && (
          <div className="technical-section">
            <h2 className="technical-section-title">cat experience.log</h2>
            {resumeData.experience.map((exp, index) => (
              exp.company && (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <div className="technical-item-title">{exp.position}</div>
                    <div className="technical-date">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div className="technical-item-subtitle" style={{ marginBottom: '6px' }}>{exp.company}</div>
                  {exp.description?.length > 0 && (
                    <ul className="technical-list">
                      {exp.description.map((desc, i) => desc && <li key={i} className="technical-list-item">{desc}</li>)}
                    </ul>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Projects */}
        {resumeData.projects?.[0]?.name && (
          <div className="technical-section">
            <h2 className="technical-section-title">git log --projects</h2>
            {resumeData.projects.map((project, index) => (
              project.name && (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div className="technical-item-title" style={{ marginBottom: '4px' }}>
                    📦 {project.name}
                  </div>
                  {project.description && (
                    <p className="technical-text" style={{ marginBottom: '6px' }}>{project.description}</p>
                  )}
                  {project.technologies && (
                    <div style={{ marginBottom: '5px' }}>
                      <span className="technical-comment">// Tech Stack: </span>
                      <span style={{ fontSize: '10pt', color: '#c9d1d9' }}>
                        {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                      </span>
                    </div>
                  )}
                  {(project.link || project.github) && (
                    <div style={{ fontSize: '10pt', display: 'flex', gap: '12px' }}>
                      {project.link && (
                        <a href={project.link} className="technical-link">Live Demo</a>
                      )}
                      {project.github && (
                        <a href={project.github} className="technical-link">GitHub</a>
                      )}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData.education?.[0]?.institution && (
          <div className="technical-section">
            <h2 className="technical-section-title">cat education.md</h2>
            {resumeData.education.map((edu, index) => (
              edu.institution && (
                <div key={index} style={{ marginBottom: '14px' }}>
                  <div className="technical-item-title">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </div>
                  <div className="technical-item-subtitle">{edu.institution}</div>
                  <div className="technical-date">
                    {edu.startDate}–{edu.endDate}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications?.[0]?.name && (
          <div className="technical-section">
            <h2 className="technical-section-title">ls certifications/</h2>
            {resumeData.certifications.map((cert, index) => (
              cert.name && (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div className="technical-item-title">🏆 {cert.name}</div>
                  <div className="technical-item-subtitle">{cert.issuer}</div>
                  {cert.date && <div className="technical-date">{cert.date}</div>}
                  {cert.link && (
                    <div className="technical-link" style={{ fontSize: '10pt', marginTop: '4px' }}>
                      View Certificate →
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'center', color: '#8b949e', fontSize: '9pt' }}>
          <div className="technical-comment">// End of resume</div>
        </div>
      </div>
    </>
  );
}
