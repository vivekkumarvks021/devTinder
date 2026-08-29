const { z } = require("zod");

const signupSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  email: z.string().trim().email().toLowerCase(),

  password: z
    .string()
    .min(8)
    .max(72)
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character"),

  age: z.number().int().min(18).max(100).optional(),

  gender: z.enum(["male", "female", "other"]).optional(),

  about: z.string().trim().max(500).optional(),

  photoUrl: z.string().trim().url().optional(),

  skills: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
});

const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .toLowerCase(),

    password: z.string().min(1, "Password is required"),
  })
  .strict();

module.exports = { signupSchema, loginSchema };
