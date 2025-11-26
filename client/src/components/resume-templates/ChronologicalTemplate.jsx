export default function ChronologicalTemplate({ resumeData }) {
  return (
    <>
      <style>{`
        .chronological-resume {
          width: 210mm;
          min-height: 297mm;
          padding: 19mm;
          font-family: 'Times New Roman', Times, serif;
          background: white;
          color: #000000;
        }
        .chronological-name {
          font-size: 24pt;
          font-weight: bold;
          color: #000000;
          margin-bottom: 4px;
          text-align: center;
        }
        .chronological-contact {
          font-size: 10pt;
          color: #000000;
          text-align: center;
          margin-bottom: 16px;
        }
        .chronological-layout {
          display: flex;
          gap: 16mm;
          margin-top: 12px;
        }
        .chronological-sidebar {
          width: 35%;
          padding: 12px 14px;
          border-right: 1px solid #000000;
        }
        .chronological-main {
          width: 65%;
          padding-right: 8px;
        }
        .chronological-section {
          margin-bottom: 14px;
        }
        .chronological-section-title {
          font-size: 11pt;
          font-weight: bold;
          color: #000000;
          margin-bottom: 6px;
          text-transform: uppercase;
          border-bottom: 1px solid #000000;
          padding-bottom: 2px;
        }
        .chronological-sidebar .chronological-section-title {
          font-size: 10pt;
        }
        .chronological-text {
          font-size: 11pt;
          line-height: 1.4;
          color: #000000;
          text-align: justify;
        }
        .chronological-item-title {
          font-size: 11.5pt;
          font-weight: bold;
          color: #000000;
        }
        .chronological-item-subtitle {
          font-size: 11pt;
          color: #000000;
          font-style: italic;
        }
        .chronological-date {
          font-size: 10pt;
          color: #000000;
        }
        .chronological-list {
          margin: 4px 0 0 20px;
          padding: 0;
          list-style-type: disc;
        }
        .chronological-list-item {
          font-size: 11pt;
          color: #000000;
          line-height: 1.4;
          margin-bottom: 4px;
        }
        .chronological-link {
          color: #000000;
          text-decoration: underline;
        }
        .chronological-contact-item {
          font-size: 10pt;
          color: #000000;
          margin-bottom: 4px;
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }
        .chronological-contact-bullet {
          width: 4px;
          height: 4px;
          background: #000000;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .chronological-skill-item {
          font-size: 10pt;
          color: #000000;
          margin-bottom: 3px;
          line-height: 1.3;
        }
      `}</style>
      
      <div className="chronological-resume" data-resume-preview>
        {/* Header */}
        {resumeData.personalInfo?.fullName && (
          <div style={{ marginBottom: '12px' }}>
            <h1 className="chronological-name">{resumeData.personalInfo.fullName}</h1>
            <div className="chronological-contact">
              {resumeData.personalInfo.email && resumeData.personalInfo.email}
              {resumeData.personalInfo.phone && ` | ${resumeData.personalInfo.phone}`}
              {resumeData.personalInfo.location && ` | ${resumeData.personalInfo.location}`}
            </div>
            {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github || resumeData.personalInfo.website) && (
              <div className="chronological-contact" style={{ marginTop: '4px' }}>
                {resumeData.personalInfo.linkedin && (
                  <a href={resumeData.personalInfo.linkedin} className="chronological-link">LinkedIn</a>
                )}
                {resumeData.personalInfo.linkedin && (resumeData.personalInfo.github || resumeData.personalInfo.website) && ' | '}
                {resumeData.personalInfo.github && (
                  <a href={resumeData.personalInfo.github} className="chronological-link">GitHub</a>
                )}
                {resumeData.personalInfo.github && resumeData.personalInfo.website && ' | '}
                {resumeData.personalInfo.website && (
                  <a href={resumeData.personalInfo.website} className="chronological-link">Website</a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="chronological-layout">
          {/* Left Sidebar */}
          <div className="chronological-sidebar">
            {/* Contact Information */}
            {resumeData.personalInfo && (
              <div className="chronological-section">
                <h2 className="chronological-section-title">Contact</h2>
                {resumeData.personalInfo.email && (
                  <div className="chronological-contact-item">
                    <div className="chronological-contact-bullet"></div>
                    <div>{resumeData.personalInfo.email}</div>
                  </div>
                )}
                {resumeData.personalInfo.phone && (
                  <div className="chronological-contact-item">
                    <div className="chronological-contact-bullet"></div>
                    <div>{resumeData.personalInfo.phone}</div>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="chronological-contact-item">
                    <div className="chronological-contact-bullet"></div>
                    <div>{resumeData.personalInfo.location}</div>
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && resumeData.skills[0]?.items && (
              <div className="chronological-section">
                <h2 className="chronological-section-title">Skills</h2>
                <div>
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
                            <div key={`${index}-${lineIndex}`} className="chronological-skill-item">
                              <span style={{ fontWeight: 'bold' }}>{categoryMatch[1]}: </span>
                              <span>{categoryMatch[2]}</span>
                            </div>
                          );
                        }
                        
                        return (
                          <div key={`${index}-${lineIndex}`} className="chronological-skill-item">
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
              <div className="chronological-section">
                <h2 className="chronological-section-title">Education</h2>
                {resumeData.education.map((edu, index) => (
                  edu.institution && (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '10.5pt', fontWeight: 'bold', marginBottom: '2px' }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </div>
                      <div style={{ fontSize: '10pt', marginBottom: '2px' }}>
                        {edu.institution}
                      </div>
                      <div style={{ fontSize: '9pt', color: '#333' }}>
                        {edu.startDate}-{edu.endDate}
                      </div>
                      {edu.gpa && (
                        <div style={{ fontSize: '9pt', color: '#333', marginTop: '2px' }}>
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
              <div className="chronological-section">
                <h2 className="chronological-section-title">Certifications</h2>
                {resumeData.certifications.map((cert, index) => (
                  cert.name && (
                    <div key={index} style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '10pt', fontWeight: 'bold', color: '#000000', marginBottom: '2px' }}>
                        {cert.name}
                      </div>
                      {cert.issuer && (
                        <div style={{ fontSize: '9pt', color: '#333', marginBottom: '2px' }}>
                          {cert.issuer}
                        </div>
                      )}
                      {cert.date && (
                        <div style={{ fontSize: '9pt', color: '#333', marginBottom: '2px' }}>
                          {cert.date}
                        </div>
                      )}
                      {cert.link && (
                        <div style={{ fontSize: '9pt' }}>
                          <a href={cert.link} className="chronological-link">View</a>
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Languages */}
            {resumeData.languages && resumeData.languages.filter(lang => lang && lang.trim()).length > 0 && (
              <div className="chronological-section">
                <h2 className="chronological-section-title">Languages</h2>
                <div className="space-y-0.5">
                  {resumeData.languages.filter(lang => lang && lang.trim()).map((lang, index) => (
                    <div key={index} style={{ fontSize: '10pt', marginBottom: '3px' }}>
                      {lang}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {resumeData.interests && resumeData.interests.filter(interest => interest && interest.trim()).length > 0 && (
              <div className="chronological-section">
                <h2 className="chronological-section-title">Interests</h2>
                <div className="space-y-0.5">
                  {resumeData.interests.filter(interest => interest && interest.trim()).map((interest, index) => (
                    <div key={index} style={{ fontSize: '10pt', marginBottom: '3px' }}>
                      {interest}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer Work */}
            {resumeData.volunteer && resumeData.volunteer.length > 0 && resumeData.volunteer[0]?.organization && (
              <div className="chronological-section">
                <h2 className="chronological-section-title">Volunteer</h2>
                {resumeData.volunteer.map((vol, index) => (
                  vol.organization && (
                    <div key={index} style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '2px' }}>
                        {vol.role}
                      </div>
                      <div style={{ fontSize: '9pt', color: '#333', marginBottom: '2px' }}>
                        {vol.organization}
                      </div>
                      {vol.date && (
                        <div style={{ fontSize: '9pt', color: '#333' }}>
                          {vol.date}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Right Main Content */}
          <div className="chronological-main">

            {/* Professional Summary */}
            {resumeData.summary && (
              <div className="chronological-section">
                <h2 className="chronological-section-title">About</h2>
                <p className="chronological-text">{resumeData.summary}</p>
              </div>
            )}

            {/* Professional Experience - Main Focus */}
            {resumeData.experience && resumeData.experience.length > 0 && resumeData.experience[0]?.company && (
              <div className="chronological-section">
                <h2 className="chronological-section-title">Professional Experience</h2>
                {resumeData.experience.map((exp, index) => (
                  exp.company && (
                    <div key={index} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <div className="chronological-item-title">{exp.position}</div>
                        <div className="chronological-date">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                      </div>
                      <div className="chronological-item-subtitle" style={{ marginBottom: '4px' }}>{exp.company}</div>
                      {exp.description && exp.description.length > 0 && (
                        <ul className="chronological-list">
                          {exp.description.map((desc, i) => (
                            desc && <li key={i} className="chronological-list-item">{desc}</li>
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
              <div className="chronological-section">
                <h2 className="chronological-section-title">Projects</h2>
                {resumeData.projects.map((project, index) => (
                  project.name && (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <div className="chronological-item-title" style={{ marginBottom: '2px' }}>{project.name}</div>
                      {project.description && (
                        <p className="chronological-text" style={{ marginBottom: '3px' }}>{project.description}</p>
                      )}
                      {project.technologies && (
                        <div style={{ fontSize: '11pt', color: '#000000', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 'bold' }}>Tech Stack: </span>
                          {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                        </div>
                      )}
                      {(project.link || project.github) && (
                        <div style={{ fontSize: '10pt', display: 'flex', gap: '12px' }}>
                          {project.link && (
                            <a href={project.link} className="chronological-link">Live Demo</a>
                          )}
                          {project.github && (
                            <a href={project.github} className="chronological-link">GitHub</a>
                          )}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}


          </div>
        </div>
      </div>
    </>
  );
}
