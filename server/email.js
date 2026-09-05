const nodemailer = require('nodemailer');

// Configure your SMTP service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email service ready:', success);
  }
});

const sendWelcomeEmail = async (email) => {
  try {
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to Nexus Consensus',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
              .content { padding: 30px 0; }
              .footer { text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; }
              a { color: #6366f1; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Nexus Consensus</h1>
              </div>
              <div class="content">
                <p>Thanks for subscribing! 🎉</p>
                <p>You'll now receive new insights, data notes, and community highlights directly in your inbox. No spam, we promise.</p>
                <p>Stay ahead of the consensus,<br><strong>Nexus Consensus Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2026 Nexus Consensus · Research for informational purposes only</p>
                <p>You can unsubscribe anytime by replying to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail
};
