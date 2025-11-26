export default function MinimalTemplate({ resumeData }) {
  return (
    <>
      <style>{`
        .minimal-resume {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: white;
          color: #000;
          font-weight: 300;
        }
        .minimal-name {
          font-size: 32pt;
          font-weight: 200;
          letter-spacing: -1px;
          margin-bottom: 6px;
          color: #000;
        }
        .minimal-contact {
          font-size: 10pt;
          color: #000;
          margin-bottom: 20px;
          font-weight: 300;
        }
        .minimal-section {
          margin-bottom: 18px;
        }
        .minimal-section-title {
          font-size: 11pt;
          font-weight: 600;
          color: #000;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-bottom: 1px solid #e5e5e5;
          padding-bottom: 4px;
        }
        .minimal-text {
          font-size: 11pt;
          line-height: 1.4;
          color: #000;
          font-weight: 300;
          text-align: justify;
        }
        .minimal-item-title {
          font-size: 12pt;
          font-weight: 500;
          color: #000;
        }
        .minimal-item-subtitle {
          font-size: 11pt;
          color: #000;
          font-weight: 400;
        }
        .minimal-date {
          font-size: 10pt;
          color: #000;
          font-weight: 300;
        }
        .minimal-list {
          margin: 6px 0 0 18px;
          padding: 0;
          list-style-type: none;
        }
        .minimal-list-item {
          font-size: 11pt;
          color: #000;
          line-height: 1.4;
          margin-bottom: 4px;
          font-weight: 300;
          position: relative;
          padding-left: 12px;
        }
        .minimal-list-item:before {
          content: "–";
          position: absolute;
          left: 0;
        }
        .minimal-link {
          color: #000;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
        }
      `}</style>
      
      <div className="minimal-resume" data-resume-preview>
        {/* Header */}
        {resumeData.personalInfo?.fullName && (
          <div style={{ marginBottom: '30px' }}>
            <h1 className="minimal-name">{resumeData.personalInfo.fullName}</h1>
            <div className="minimal-contact">
              {[
                resumeData.personalInfo.email,
                resumeData.personalInfo.phone,
                resumeData.personalInfo.location
              ].filter(Boolean).join('  ·  ')}
            </div>
            {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github || resumeData.personalInfo.website) && (
              <div className="minimal-contact" style={{ display: 'flex', gap: '12px' }}>
                {resumeData.personalInfo.linkedin && (
                  <a href={resumeData.personalInfo.linkedin} className="minimal-link">
                    LinkedIn
                  </a>
                )}
                {resumeData.personalInfo.github && (
                  <a href={resumeData.personalInfo.github} className="minimal-link">
                    GitHub
                  </a>
                )}
                {resumeData.personalInfo.website && (
                  <a href={resumeData.personalInfo.website} className="minimal-link">
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {resumeData.summary && (
          <div className="minimal-section">
            <h2 className="minimal-section-title">Summary</h2>
            <p className="minimal-text">{resumeData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience?.[0]?.company && (
          <div className="minimal-section">
            <h2 className="minimal-section-title">Experience</h2>
            {resumeData.experience.map((exp, index) => (
              exp.company && (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <div className="minimal-item-title">{exp.position}</div>
                    <div className="minimal-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div className="minimal-item-subtitle" style={{ marginBottom: '6px' }}>{exp.company}</div>
                  {exp.description?.length > 0 && (
                    <ul className="minimal-list">
                      {exp.description.map((desc, i) => desc && <li key={i} className="minimal-list-item">{desc}</li>)}
                    </ul>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Projects */}
        {resumeData.projects?.[0]?.name && (
          <div className="minimal-section">
            <h2 className="minimal-section-title">Projects</h2>
            {resumeData.projects.map((project, index) => (
              project.name && (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div className="minimal-item-title" style={{ marginBottom: '3px' }}>{project.name}</div>
                  {project.description && <p className="minimal-text" style={{ marginBottom: '4px' }}>{project.description}</p>}
                  {project.technologies && (
                    <div className="minimal-text" style={{ marginBottom: '4px' }}>
                      <span style={{ fontWeight: '500' }}>Tech Stack: </span>
                      {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                    </div>
                  )}
                  {(project.link || project.github) && (
                    <div style={{ fontSize: '10pt', display: 'flex', gap: '12px' }}>
                      {project.link && (
                        <a href={project.link} className="minimal-link">
                          Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} className="minimal-link">
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

        {/* Skills */}
        {resumeData.skills?.[0]?.items && (
          <div className="minimal-section">
            <h2 className="minimal-section-title">Skills</h2>
            <div>
              {resumeData.skills.map((skillGroup, index) => {
                const skillsText = Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items;
                const lines = skillsText?.split('\n').filter(line => line.trim());
                
                return lines?.map((line, lineIndex) => {
                  const categoryMatch = line.match(/^([^:]+):\s*(.+)$/);
                  if (categoryMatch) {
                    return (
                      <div key={`${index}-${lineIndex}`} style={{ marginBottom: '3px', lineHeight: '1.3' }}>
                        <span style={{ fontWeight: '500', color: '#000', fontSize: '11pt' }}>{categoryMatch[1]}: </span>
                        <span style={{ fontSize: '11pt', color: '#000', fontWeight: '300' }}>{categoryMatch[2]}</span>
                      </div>
                    );
                  }
                  return <div key={`${index}-${lineIndex}`} style={{ fontSize: '11pt', color: '#000', marginBottom: '2px', lineHeight: '1.3' }}>{line}</div>;
                });
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education?.[0]?.institution && (
          <div className="minimal-section">
            <h2 className="minimal-section-title">Education</h2>
            {resumeData.education.map((edu, index) => (
              edu.institution && (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div className="minimal-item-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div className="minimal-date">{edu.startDate}–{edu.endDate}</div>
                  </div>
                  <div className="minimal-item-subtitle">
                    {edu.institution}
                    {edu.gpa && ` · GPA: ${edu.gpa}`}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications?.[0]?.name && (
          <div className="minimal-section">
            <h2 className="minimal-section-title">Certifications</h2>
            {resumeData.certifications.map((cert, index) => (
              cert.name && (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <div className="minimal-item-title">{cert.name}</div>
                  <div className="minimal-item-subtitle">
                    {cert.issuer}
                    {cert.date && ` · ${cert.date}`}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </>
  );
}
