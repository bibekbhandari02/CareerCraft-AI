import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP)
  // For production, use real SMTP (Gmail, SendGrid, etc.)
  
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Development: Log emails to console
  return {
    sendMail: async (mailOptions) => {
      console.log('\n📧 EMAIL WOULD BE SENT:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Content:', mailOptions.text || mailOptions.html);
      console.log('---\n');
      return { messageId: 'dev-' + Date.now() };
    }
  };
};

const transporter = createTransporter();

// Email templates
export const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'CareerCraft AI <noreply@careercraft.ai>',
    to: user.email,
    subject: 'Welcome to CareerCraft AI! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome to CareerCraft AI!</h1>
        <p>Hi ${user.name},</p>
        <p>Thank you for joining CareerCraft AI! We're excited to help you build your career.</p>
        
        <h2 style="color: #4F46E5;">What's Next?</h2>
        <ul>
          <li>✨ Create your first AI-powered resume</li>
          <li>🌐 Build a stunning portfolio website</li>
          <li>📝 Generate personalized cover letters</li>
        </ul>
        
        <h3>Your Account Details:</h3>
        <ul>
          <li><strong>Plan:</strong> ${user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)}</li>
          <li><strong>Resume Credits:</strong> ${user.credits.resumeGenerations}</li>
          <li><strong>Portfolio Credits:</strong> ${user.credits.portfolios}</li>
          <li><strong>Cover Letter Credits:</strong> ${user.credits.coverLetters}</li>
        </ul>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Need help? Reply to this email or visit our support center.
        </p>
        
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The CareerCraft AI Team
        </p>
      </div>
    `,
    text: `
Welcome to CareerCraft AI!

Hi ${user.name},

Thank you for joining CareerCraft AI! We're excited to help you build your career.

What's Next?
- Create your first AI-powered resume
- Build a stunning portfolio website
- Generate personalized cover letters

Your Account Details:
- Plan: ${user.subscription}
- Resume Credits: ${user.credits.resumeGenerations}
- Portfolio Credits: ${user.credits.portfolios}
- Cover Letter Credits: ${user.credits.coverLetters}

Visit your dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard

Need help? Reply to this email or visit our support center.

Best regards,
The CareerCraft AI Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', user.email);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
  }
};

export const sendCreditLowAlert = async (user, creditType) => {
  const creditNames = {
    resumeGenerations: 'Resume',
    portfolios: 'Portfolio',
    coverLetters: 'Cover Letter'
  };

  const mailOptions = {
    from: process.env.SMTP_FROM || 'CareerCraft AI <noreply@careercraft.ai>',
    to: user.email,
    subject: `⚠️ Your ${creditNames[creditType]} Credits are Running Low`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F59E0B;">Credits Running Low</h1>
        <p>Hi ${user.name},</p>
        <p>Your ${creditNames[creditType]} credits are running low!</p>
        
        <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px;">
            <strong>Remaining Credits:</strong> ${user.credits[creditType]}
          </p>
        </div>
        
        <p>Don't let this stop your progress! Upgrade your plan to get more credits and unlock premium features.</p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Upgrade Now
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The CareerCraft AI Team
        </p>
      </div>
    `,
    text: `
Credits Running Low

Hi ${user.name},

Your ${creditNames[creditType]} credits are running low!

Remaining Credits: ${user.credits[creditType]}

Don't let this stop your progress! Upgrade your plan to get more credits and unlock premium features.

Upgrade now: ${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing

Best regards,
The CareerCraft AI Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Credit alert sent to: ${user.email}`);
  } catch (error) {
    console.error('❌ Failed to send credit alert:', error);
  }
};

export const sendSubscriptionReminder = async (user) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'CareerCraft AI <noreply@careercraft.ai>',
    to: user.email,
    subject: '💎 Upgrade to Premium and Unlock All Features',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Ready to Level Up?</h1>
        <p>Hi ${user.name},</p>
        <p>You're doing great with the free plan! But imagine what you could achieve with unlimited access...</p>
        
        <h2 style="color: #4F46E5;">Premium Benefits:</h2>
        <ul>
          <li>✨ Unlimited AI-powered resume generations</li>
          <li>🎨 Access to all premium templates</li>
          <li>🌐 Multiple portfolio websites</li>
          <li>📝 Unlimited cover letters</li>
          <li>📊 Advanced analytics</li>
          <li>🚀 Priority support</li>
        </ul>
        
        <div style="background-color: #EEF2FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; text-align: center;">
            <strong>Special Offer: Get 20% off your first month!</strong>
          </p>
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View Pricing Plans
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The CareerCraft AI Team
        </p>
      </div>
    `,
    text: `
Ready to Level Up?

Hi ${user.name},

You're doing great with the free plan! But imagine what you could achieve with unlimited access...

Premium Benefits:
- Unlimited AI-powered resume generations
- Access to all premium templates
- Multiple portfolio websites
- Unlimited cover letters
- Advanced analytics
- Priority support

Special Offer: Get 20% off your first month!

View pricing: ${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing

Best regards,
The CareerCraft AI Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Subscription reminder sent to: ${user.email}`);
  } catch (error) {
    console.error('❌ Failed to send subscription reminder:', error);
  }
};

export const sendWeeklyTips = async (user) => {
  const tips = [
    'Use action verbs like "Built", "Developed", "Optimized" in your resume',
    'Quantify your achievements with numbers and percentages',
    'Keep your resume to 1-2 pages for optimal ATS performance',
    'Customize your resume for each job application',
    'Include 15+ relevant skills organized by category'
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const mailOptions = {
    from: process.env.SMTP_FROM || 'CareerCraft AI <noreply@careercraft.ai>',
    to: user.email,
    subject: '💡 Weekly Career Tip from CareerCraft AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Your Weekly Career Tip</h1>
        <p>Hi ${user.name},</p>
        
        <div style="background-color: #EEF2FF; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
          <p style="margin: 0; font-size: 18px;">
            💡 <strong>Tip of the Week:</strong><br><br>
            ${randomTip}
          </p>
        </div>
        
        <p>Want to improve your resume score? Use our ATS checker to get instant feedback!</p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Check Your Resume
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The CareerCraft AI Team
        </p>
      </div>
    `,
    text: `
Your Weekly Career Tip

Hi ${user.name},

Tip of the Week:
${randomTip}

Want to improve your resume score? Use our ATS checker to get instant feedback!

Visit your dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard

Best regards,
The CareerCraft AI Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Weekly tip sent to: ${user.email}`);
  } catch (error) {
    console.error('❌ Failed to send weekly tip:', error);
  }
};
