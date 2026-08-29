const { z } = require("zod");

const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must contain at least 2 characters")
      .max(50, "First name cannot exceed 50 characters")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must contain at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters")
      .optional(),

    age: z
      .number()
      .int("Age must be a whole number")
      .min(18, "User must be at least 18 years old")
      .max(100, "Age cannot exceed 100")
      .optional(),

    gender: z.enum(["male", "female", "other"]).optional(),

    about: z
      .string()
      .trim()
      .max(500, "About cannot exceed 500 characters")
      .optional(),

    photoUrl: z
      .string()
      .trim()
      .url("Please provide a valid photo URL")
      .optional(),

    skills: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Skill cannot be empty")
          .max(50, "Skill cannot exceed 50 characters"),
      )
      .max(20, "A maximum of 20 skills is allowed")
      .refine(
        (skills) =>
          new Set(skills.map((skill) => skill.toLowerCase())).size ===
          skills.length,
        {
          message: "Duplicate skills are not allowed",
        },
      )
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field is required",
  });

module.exports = { updateProfileSchema };
