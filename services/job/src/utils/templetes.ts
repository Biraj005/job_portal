import { application_status } from "../generated/prisma/enums.js";

export const jobStatuseUpdateTemplete = (
  companyname: string,
  status: application_status,
) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Application Status Update</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:20px 10px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#2563eb; padding:20px; color:#ffffff;">
                <h2 style="margin:0;">${companyname}</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">

                <p>
                  We wanted to inform you that the status of your application for the role of
                  <strong>{{jobTitle}}</strong> has been updated.
                </p>

                <p style="margin:20px 0;">
                  <strong>Current Status:</strong>
                  <span style="
                    padding:6px 12px;
                    background:#eef2ff;
                    color:#1e40af;
                    border-radius:4px;
                    font-weight:bold;
                  ">
                    ${status}
                  </span>
                </p>

                <p>
                  We appreciate the time and effort you put into your application.
                  Our team will reach out if there are any next steps.
                </p>

                <p>
                  If you have any questions, feel free to reply to this email.
                </p>

                <p style="margin-bottom:0;">
                  Best regards,<br />
                  <strong>${companyname} Hiring Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#64748b;">
                © 2026 ${companyname}. All rights reserved.
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
