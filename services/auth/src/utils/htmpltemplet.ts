export const getHtml = (name: string) => {
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
