import jsPDF from 'jspdf';

export const generateResumePDF = (resumeData) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Helper function to add text with word wrap
  const addText = (text, fontSize = 11, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight;
  };

  const addSection = (title) => {
    yPosition += 5;
    doc.setDrawColor(79, 70, 229); // Indigo color
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    addText(title, 14, true);
    yPosition += 3;
  };

  // Header - Personal Info
  if (resumeData.personalInfo?.fullName) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229); // Indigo
    doc.text(resumeData.personalInfo.fullName, margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const contactInfo = [];
    if (resumeData.personalInfo.email) contactInfo.push(resumeData.personalInfo.email);
    if (resumeData.personalInfo.phone) contactInfo.push(resumeData.personalInfo.phone);
    if (resumeData.personalInfo.location) contactInfo.push(resumeData.personalInfo.location);
    
    if (contactInfo.length > 0) {
      doc.text(contactInfo.join(' | '), margin, yPosition);
      yPosition += 6;
    }
    
    const links = [];
    if (resumeData.personalInfo.linkedin) links.push(resumeData.personalInfo.linkedin);
    if (resumeData.personalInfo.github) links.push(resumeData.personalInfo.github);
    
    if (links.length > 0) {
      doc.text(links.join(' | '), margin, yPosition);
      yPosition += 8;
    }
  }

  doc.setTextColor(0, 0, 0); // Reset to black

  // Professional Summary
  if (resumeData.summary) {
    addSection('PROFESSIONAL SUMMARY');
    addText(resumeData.summary);
  }

  // Work Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    addSection('WORK EXPERIENCE');
    
    resumeData.experience.forEach((exp) => {
      if (exp.company || exp.position) {
        addText(`${exp.position || 'Position'} at ${exp.company || 'Company'}`, 12, true);
        
        if (exp.startDate || exp.endDate) {
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          const dates = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
          doc.text(dates, margin, yPosition);
          yPosition += lineHeight;
          doc.setTextColor(0, 0, 0);
        }
        
        if (exp.description && Array.isArray(exp.description)) {
          exp.description.forEach((desc) => {
            if (desc) {
              addText(`• ${desc}`, 10);
            }
          });
        }
        yPosition += 3;
      }
    });
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    addSection('EDUCATION');
    
    resumeData.education.forEach((edu) => {
      if (edu.institution || edu.degree) {
        addText(`${edu.degree || 'Degree'} in ${edu.field || 'Field'}`, 12, true);
        addText(edu.institution || 'Institution', 11);
        
        if (edu.startDate || edu.endDate) {
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`${edu.startDate || ''} - ${edu.endDate || ''}`, margin, yPosition);
          yPosition += lineHeight;
          doc.setTextColor(0, 0, 0);
        }
        
        if (edu.gpa) {
          addText(`GPA: ${edu.gpa}`, 10);
        }
        yPosition += 3;
      }
    });
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    addSection('SKILLS');
    
    resumeData.skills.forEach((skillGroup) => {
      const skillsText = Array.isArray(skillGroup.items) 
        ? skillGroup.items.join(', ') 
        : skillGroup.items;
      
      // Check if skills contain category format (e.g., "Frontend: HTML, CSS")
      const lines = skillsText?.split('\n').filter(line => line.trim());
      
      if (lines && lines.length > 0) {
        lines.forEach(line => {
          const categoryMatch = line.match(/^([^:]+):\s*(.+)$/);
          
          if (categoryMatch) {
            // Has category format
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`${categoryMatch[1]}:`, margin, yPosition);
            
            doc.setFont('helvetica', 'normal');
            const categoryWidth = doc.getTextWidth(`${categoryMatch[1]}: `);
            const skillsLines = doc.splitTextToSize(categoryMatch[2], contentWidth - categoryWidth);
            doc.text(skillsLines, margin + categoryWidth, yPosition);
            yPosition += skillsLines.length * lineHeight;
          } else {
            // No category, just add the text
            addText(line, 10);
          }
        });
      } else if (skillGroup.category) {
        // Use category field if available
        addText(skillGroup.category, 11, true);
        addText(skillsText, 10);
        yPosition += 2;
      } else {
        // Default
        addText(skillsText, 10);
        yPosition += 2;
      }
    });
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    addSection('PROJECTS');
    
    resumeData.projects.forEach((project) => {
      if (project.name) {
        addText(project.name, 12, true);
        if (project.description) {
          addText(project.description, 10);
        }
        if (project.technologies) {
          const techText = Array.isArray(project.technologies) 
            ? project.technologies.join(', ') 
            : project.technologies;
          addText(`Technologies: ${techText}`, 9);
        }
        yPosition += 3;
      }
    });
  }

  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    addSection('CERTIFICATIONS');
    
    resumeData.certifications.forEach((cert) => {
      if (cert.name) {
        addText(`${cert.name} - ${cert.issuer || ''}`, 11, true);
        if (cert.date) {
          addText(cert.date, 10);
        }
        yPosition += 2;
      }
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  return doc;
};

export const downloadResumePDF = (resumeData, filename = 'resume.pdf') => {
  const doc = generateResumePDF(resumeData);
  doc.save(filename);
};
