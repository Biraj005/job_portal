export const getHtmlForRegistration = (name: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Job Portal Email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:6px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#2563eb; color:#ffffff; padding:20px; text-align:center;">
              <h1 style="margin:0; font-size:24px;">JobPortal</h1>
              <p style="margin:5px 0 0; font-size:14px;">Find Your Next Opportunity</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px; margin-top:0;">
                Hello <strong>${name}</strong>,
              </p>

              <p style="font-size:14px; line-height:1.6;">
                We’re excited to inform you that new job opportunities matching your profile
                have just been posted on <strong>JobPortal</strong>.
              </p>

              <p style="font-size:14px; line-height:1.6;">
                These roles are tailored to your skills, experience, and preferences. Don’t miss
                the chance to apply and take the next step in your career.
              </p>

              <!-- CTA Button -->
             
              <p style="font-size:14px; line-height:1.6;">
                If you have any questions or need assistance, feel free to contact our support team.
              </p>

              <p style="font-size:14px; margin-bottom:0;">
                Best regards,<br />
                <strong>The JobPortal Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#666666;">
              <p style="margin:0;">
                © 2026 JobPortal. All rights reserved.
              </p>
              <p style="margin:5px 0 0;">
                You are receiving this email because you registered on JobPortal.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export const getHtmlFroReset = (link: string,name:string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f7;
      color: #51545e;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #4f46e5;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .body {
      padding: 30px;
      text-align: center;
    }
    .body h2 {
      font-size: 20px;
      margin-bottom: 10px;
      color: #333333;
    }
    .body p {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 25px;
      background-color: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      background-color: #f4f4f7;
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #888888;
    }
    @media only screen and (max-width: 600px) {
      .body {
        padding: 20px;
      }
      .header h1 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="body">
      <h2>Hello, ${name}</h2>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${link}" class="button">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Link expires in 1 hour.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().toLocaleString("default", { year: "numeric" })} Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};
