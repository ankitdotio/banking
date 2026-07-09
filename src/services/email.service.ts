import nodemailer from "nodemailer";
import config from "../config/config.js";
import logger from "../util/logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.EMAIL_USER,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    refreshToken: config.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
// eslint-disable-next-line @typescript-eslint/no-unused-vars
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    logger.info(`EMAIL SERVER STARTED :`, {
      meta: {
        message: "Email server is ready to send messages",

        type: "OAuth2",
        user: config.EMAIL_USER,
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        refreshToken: config.REFRESH_TOKEN,
      },
    });
  }
});

// Function to send email
const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${config.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
    logger.info(`MESSAGE SEND :`, {
      meta: {
        message: info.messageId,
      },
    });
    const nodemailInfo = nodemailer.getTestMessageUrl(info);
    logger.info(`Preview URL: %s `, {
      meta: {
        message: nodemailInfo,
      },
    });
  } catch (error) {
    logger.error("ERROR IN SENDING THE EMAIL", {
      meta: {
        message: "Error sending email:",
        error: error,
      },
    });
  }
};

export const sendRegistrationEmail = async (
  userEmail: string,
  name: string,
) => {
  logger.info("INSIDE THE SEND REGISTRATION FUNCTION");
  const subject = "Welcome to Backend Ledger 🎉";
  const text = "thank you...";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f7fb;padding:40px 0;">
<tr>
<td align="center">

<table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);">

<tr>
<td style="background:#111827;padding:40px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:bold;">
Backend Ledger
</h1>

<p style="margin:12px 0 0;color:#cbd5e1;font-size:16px;">
Modern Banking API Platform
</p>
</td>
</tr>

<tr>
<td style="padding:48px 40px;">

<h2 style="margin:0;color:#111827;font-size:28px;">
Welcome, ${name}! 👋
</h2>

<p style="margin:24px 0;color:#4b5563;font-size:16px;line-height:1.8;">
Thank you for joining <strong>Backend Ledger</strong>.
Your account has been successfully created and you're ready to start exploring our platform.
</p>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:35px 0;">
<tr>
<td align="center" bgcolor="#2563eb" style="border-radius:8px;">
<a
href="#"
style="
display:inline-block;
padding:16px 32px;
font-size:16px;
font-weight:bold;
color:#ffffff;
text-decoration:none;
">
Go to Dashboard
</a>
</td>
</tr>
</table>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:35px 0;" />

<p style="margin:0 0 12px;font-size:18px;font-weight:bold;color:#111827;">
What's next?
</p>

<ul style="padding-left:18px;color:#4b5563;line-height:1.9;margin:0;">
<li>Complete your profile.</li>
<li>Explore available APIs.</li>
<li>Generate your first API key.</li>
<li>Read our documentation.</li>
</ul>

<p style="margin-top:35px;color:#4b5563;line-height:1.8;">
If you didn't create this account, you can safely ignore this email.
</p>

<p style="margin-top:40px;color:#111827;font-weight:bold;">
Welcome aboard! 🚀
</p>

</td>
</tr>

<tr>
<td style="background:#f9fafb;padding:30px;text-align:center;">

<p style="margin:0;font-size:14px;color:#6b7280;">
This email was sent to
<strong>${userEmail}</strong>
</p>

<p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
© ${new Date().getFullYear()} Backend Ledger.
All rights reserved.
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

  await sendEmail(userEmail, subject, text, html);
};

export const sendTransactionEmail = async (
  userEmail: string,
  name: string,
  amount: number,
  toAccount: string,
) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Transaction Alert</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="background:#ffffff;border-radius:8px;overflow:hidden;"
        >
          <tr>
            <td
              style="background:#1f2937;color:#ffffff;padding:24px;text-align:center;font-size:24px;font-weight:bold;"
            >
              Transaction Alert
            </td>
          </tr>

          <tr>
            <td style="padding:32px;color:#333333;">
              <h2 style="margin-top:0;">Hello ${name},</h2>

              <p style="font-size:16px;line-height:1.6;">
                We wanted to let you know that a transaction has been made from
                your account.
              </p>

              <table
                width="100%"
                cellpadding="12"
                cellspacing="0"
                style="margin:24px 0;border:1px solid #e5e7eb;border-collapse:collapse;"
              >
                <tr>
                  <td style="font-weight:bold;border-bottom:1px solid #e5e7eb;">
                    Amount
                  </td>
                  <td style="border-bottom:1px solid #e5e7eb;">
                    ₹${amount}
                  </td>
                </tr>

                <tr>
                  <td style="font-weight:bold;">Transferred To</td>
                  <td>${toAccount}</td>
                </tr>
              </table>

              <p style="font-size:16px;line-height:1.6;">
                <strong>If you authorized this transaction, no further action is
                required.</strong>
              </p>

              <p
                style="font-size:16px;line-height:1.6;color:#dc2626;font-weight:bold;"
              >
                If you did NOT authorize this transaction, please contact our
                support team immediately to secure your account.
              </p>

              <div style="text-align:center;margin:32px 0;">
                <a
                  href="mailto:support@yourbank.com"
                  style="background:#dc2626;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;display:inline-block;font-weight:bold;"
                >
                  Contact Support
                </a>
              </div>

              <p style="font-size:14px;color:#6b7280;line-height:1.6;">
                For your security, never share your OTP, password, or PIN with
                anyone. Our team will never ask for these details.
              </p>

              <p style="margin-top:32px;">
                Regards,<br />
                <strong>Your Banking Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td
              style="background:#f3f4f6;padding:20px;text-align:center;font-size:12px;color:#6b7280;"
            >
              This is an automated email. Please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // send email using your transporter
  await sendEmail(userEmail, "TRANSACTION INFORMATION", "IMPORTANT", html);
};

export const sendTransactionFailureEmail = async (
  userEmail: string,
  name: string,
  amount: number,
  toAccount: string,
) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Transaction Failed</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table
          role="presentation"
          width="600"
          cellspacing="0"
          cellpadding="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);"
        >
          <tr>
            <td
              style="background:#dc2626;padding:24px;text-align:center;color:#ffffff;font-size:26px;font-weight:bold;"
            >
              Transaction Failed
            </td>
          </tr>

          <tr>
            <td style="padding:32px;color:#333333;font-size:16px;line-height:1.7;">
              <p style="margin-top:0;">Hi <strong>${name}</strong>,</p>

              <p>
                We were unable to complete your recent transaction. No money has
                been deducted from your account.
              </p>

              <table
                width="100%"
                cellspacing="0"
                cellpadding="10"
                style="margin:24px 0;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa;"
              >
                <tr>
                  <td><strong>Amount</strong></td>
                  <td>₹${amount.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td><strong>Recipient Account</strong></td>
                  <td>${toAccount}</td>
                </tr>
                <tr>
                  <td><strong>Status</strong></td>
                  <td style="color:#dc2626;font-weight:bold;">Failed</td>
                </tr>
              </table>

              <p>
                This may have happened because of one of the following reasons:
              </p>

              <ul style="padding-left:20px;">
                <li>Insufficient account balance.</li>
                <li>Recipient account details are invalid.</li>
                <li>Temporary banking service interruption.</li>
                <li>The transaction exceeded the allowed limit.</li>
              </ul>

              <p>
                Please verify the transaction details and try again. If the
                problem continues, contact our support team for assistance.
              </p>

              <p style="margin-top:32px;">
                Thank you,<br />
                <strong>Backend Ledger Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td
              style="padding:20px;background:#f9fafb;text-align:center;color:#6b7280;font-size:13px;"
            >
              This is an automated email. Please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  // send email using your mail service

  await sendEmail(
    userEmail,
    "TRANSACTION INFORMATION - FAILED",
    "IMPORTANT",
    html,
  );
};
