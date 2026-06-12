import config from "../config/dotenv.config.js";
import transporter from "../config/mail.config.js";

export const sendVerificationEmail = async (
  email,
  verificationLink
) => {

  await transporter.sendMail({
    from: `"Snitch" <${config.GOOGLE_USER}>`,
    to: email,
    subject: "Verify Your Email",

    html: `
      <div style="font-family:sans-serif">
        <h1>Email Verification</h1>

        <p>
          Click the button below to verify your email.
        </p>

        <a
          href="${verificationLink}"
          style="
            background:black;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:5px;
            display:inline-block;
          "
        >
          Verify Email
        </a>

        <p>
          This link will expire soon.
        </p>
      </div>
    `,
  });
};