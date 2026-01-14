import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host:"smt@gmail.com",
  secure:true,
  
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email error:", error);
  } else {
    console.log("Email server ready");
  }
});

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({ to, subject, html }: MailOptions) => {
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER || 'Development'}>`,
    to,
    subject,
    html,
  });
};