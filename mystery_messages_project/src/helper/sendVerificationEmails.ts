import verificationEmail from "../../emails/verificationEmail";
import ApiResponse from "@/app/types/ApiResponse.js";
import { resend } from "@/lib/resend.js";

async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "mystery verification code",
      react: verificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "verification email send successfully" };
  } catch (emailError) {
    console.error("failed to send email", emailError);
    return { success: false, message: "failed to send verification email" };
  }
}

export default sendVerificationEmail;
