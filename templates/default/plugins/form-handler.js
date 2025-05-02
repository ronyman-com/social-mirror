const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

module.exports = function(eleventyConfig) {
  eleventyConfig.addServerMiddleware(async (req, res, next) => {
    if (req.url === '/submit-contact' && req.method === 'POST') {
      try {
        const formData = req.body;
        const submissionId = uuidv4();
        const timestamp = new Date().toISOString();
        
        // 1. Save to admin_secrete.md
        const secretPath = path.join(process.cwd(), 'admin_secrete.md');
        const submissionMarkdown = `
## Submission ID: ${submissionId}
**Date:** ${timestamp}  
**Name:** ${formData.name}  
**Email:** ${formData.email}  
**Subject:** ${formData.subject}  
**Message:**  
${formData.message}  
\n---\n`;

        fs.appendFileSync(secretPath, submissionMarkdown);
        
        // 2. Send email
        const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        
        await transporter.sendMail({
          from: `"KDO Website" <${process.env.EMAIL_USER}>`,
          to: formData.emailRecipient || 'kdo.official@outlook.com',
          subject: `New Contact: ${formData.subject}`,
          text: `New submission from ${formData.name} (${formData.email}):\n\n${formData.message}`,
          html: `<p><strong>New submission from ${formData.name} (${formData.email}):</strong></p>
                 <p>${formData.message.replace(/\n/g, '<br>')}</p>`
        });
        
        res.json({ success: true, message: 'Thank you! Your message has been sent.' });
      } catch (error) {
        console.error('Form submission error:', error);
        res.json({ success: false, message: 'Error submitting form. Please try again later.' });
      }
    } else {
      next();
    }
  });
};