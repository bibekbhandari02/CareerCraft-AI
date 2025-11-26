export default function ModernTemplate({ resumeData }) {
  return (
    <>
      <style>{`
        .modern-resume {
          width: 210mm;
          min-height: 297mm;
          padding: 19mm;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background: white;
          color: #000000;
        }
        .modern-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
          padding-bottom: 12px;
          border-bottom: 3px solid #6366f1;
        }
        .modern-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          color: white;
          overflow: hidden;
        }
        .modern-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .modern-name {
          font-size: 28pt;
          font-weight: 700;
          color: #000000;
          margin-bottom: 4px;
        }
        .modern-title {
          font-size: 14pt;
          color: #6366f1;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .modern-contact {
          font-size: 10pt;
          color: #000000;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .modern-section {
          margin-bottom: 16px;
        }
        .modern-section-title {
          font-size: 14pt;
          font-weight: 700;
          color: #6366f1;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .modern-text {
          font-size: 11pt;
          line-height: 1.4;
          color: #000000;
          text-align: justify;
        }
        .modern-item-title {
          font-size: 13pt;
          font-weight: 600;
          color: #000000;
        }
        .modern-item-subtitle {
          font-size: 11pt;
          color: #6366f1;
          font-weight: 500;
        }
        .modern-date {
          font-size: 10pt;
          color: #000000;
        }
        .modern-list {
          margin: 6px 0 0 20px;
          padding: 0;
        }
        .modern-list-item {
          font-size: 11pt;
          color: #000000;
          line-height: 1.4;
          margin-bottom: 5px;
        }
        .modern-link {
          color: #6366f1;
          text-decoration: none;
        }
        .modern-skill-tag {
          display: inline-block;
          padding: 4px 12px;
          background: #eef2ff;
          color: #6366f1;
          border-radius: 12px;
          font-size: 10pt;
          margin: 4px 4px 4px 0;
        }
      `}</style>
      
      <div className="modern-resume" data-resume-preview>
        {/* Header */}
        {resumeData.personalInfo?.fullName && (
          <div className="modern-header">
            <div className="modern-avatar">
              {resumeData.personalInfo?.profileImage ? (
                <img 
                  src={resumeData.personalInfo.profileImage} 
                  alt={resumeData.personalInfo.fullName}
                  className="modern-avatar-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = resumeData.personalInfo.fullName.charAt(0).toUpperCase();
                  }}
                />
              ) : (
                resumeData.personalInfo.fullName.charAt(0).toUpperCase()
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="modern-name">{resumeData.personalInfo.fullName}</h1>
              {resumeData.personalInfo.email && (
                <div className="modern-title">Professional</div>
              )}
              <div className="modern-contact">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
              </div>
              {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github) && (
                <div className="modern-contact" style={{ marginTop: '6px' }}>
                  {resumeData.personalInfo.linkedin && (
                    <a href={resumeData.personalInfo.linkedin} className="modern-link">LinkedIn</a>
                  )}
                  {resumeData.personalInfo.github && (
                    <a href={resumeData.personalInfo.github} className="modern-link">GitHub</a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        {resumeData.summary && (
          <div className="modern-section">
            <h2 className="modern-section-title">About</h2>
            <p className="modern-text">{resumeData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience?.[0]?.company && (
          <div className="modern-section">
            <h2 className="modern-section-title">Experience</h2>
            {resumeData.experience.map((exp, index) => (
              exp.company && (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <div className="modern-item-title">{exp.position}</div>
                    <div className="modern-date">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div className="modern-item-subtitle" style={{ marginBottom: '6px' }}>{exp.company}</div>
                  {exp.description?.length > 0 && (
                    <ul className="modern-list">
                      {exp.description.map((desc, i) => desc && <li key={i} className="modern-list-item">{desc}</li>)}
                    </ul>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Projects */}
        {resumeData.projects?.[0]?.name && (
          <div className="modern-section">
            <h2 className="modern-section-title">Projects</h2>
            {resumeData.projects.map((project, index) => (
              project.name && (
                <div key={index} style={{ marginBottom: '12px' }}>
                  {/* Project Name */}
                  <div className="modern-item-title" style={{ marginBottom: '4px' }}>{project.name}</div>
                  
                  {/* Description */}
                  {project.description && (
                    <p className="modern-text" style={{ marginBottom: '6px', lineHeight: '1.4' }}>
                      {project.description}
                    </p>
                  )}
                  
                  {/* Tech Stack */}
                  {project.technologies && (
                    <div style={{ marginBottom: '5px', lineHeight: '1.4' }}>
                      <span style={{ fontSize: '11pt', fontWeight: '600', color: '#000000', marginRight: '6px' }}>
                        Tech Stack:
                      </span>
                      <span style={{ fontSize: '11pt', color: '#000000' }}>
                        {Array.isArray(project.technologies) 
                          ? project.technologies.join(', ') 
                          : project.technologies}
                      </span>
                    </div>
                  )}
                  
                  {/* Links */}
                  {(project.link || project.github) && (
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11pt', marginTop: '5px' }}>
                      {project.link && (
                        <a href={project.link} className="modern-link" style={{ fontWeight: '500' }}>
                          Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} className="modern-link" style={{ fontWeight: '500' }}>
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
          <div className="modern-section">
            <h2 className="modern-section-title">Skills</h2>
            <div>
              {resumeData.skills.map((skillGroup, index) => {
                const skillsText = Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items;
                const lines = skillsText?.split('\n').filter(line => line.trim());
                
                return lines?.map((line, lineIndex) => {
                  const categoryMatch = line.match(/^([^:]+):\s*(.+)$/);
                  if (categoryMatch) {
                    return (
                      <div key={`${index}-${lineIndex}`} style={{ marginBottom: '3px', lineHeight: '1.2' }}>
                        <span style={{ fontWeight: '600', color: '#000000', fontSize: '10.5pt' }}>{categoryMatch[1]}: </span>
                        <span style={{ fontSize: '10.5pt', color: '#000000', lineHeight: '1.2' }}>{categoryMatch[2]}</span>
                      </div>
                    );
                  }
                  return <div key={`${index}-${lineIndex}`} style={{ fontSize: '10.5pt', color: '#000000', marginBottom: '2px', lineHeight: '1.2' }}>{line}</div>;
                });
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education?.[0]?.institution && (
          <div className="modern-section">
            <h2 className="modern-section-title">Education</h2>
            {resumeData.education.map((edu, index) => (
              edu.institution && (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <div className="modern-item-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div className="modern-item-subtitle">{edu.institution}</div>
                  <div className="modern-date">
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
          <div className="modern-section">
            <h2 className="modern-section-title">Certifications</h2>
            {resumeData.certifications.map((cert, index) => (
              cert.name && (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <div className="modern-item-title">{cert.name}</div>
                  <div className="modern-item-subtitle">{cert.issuer}</div>
                  {cert.date && <div className="modern-date">{cert.date}</div>}
                  {cert.link && <a href={cert.link} className="modern-link" style={{ fontSize: '10pt' }}>View Certificate</a>}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </>
  );
}
