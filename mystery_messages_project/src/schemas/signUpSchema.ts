import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { message: "username must be atleast 2 characters" })
  .max(20, { message: "username must be no more than 20 charactes" })
  .regex(/^[a-zA-Z0-9_]{2,20}$/, {
    message:
      "Username must be 2-20 characters long and can only contain letters, numbers, and underscores",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 characters" }),
});
