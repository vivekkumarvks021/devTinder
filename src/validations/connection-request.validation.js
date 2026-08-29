const { z } = require("zod");

const sendConnectionRequestParamsSchema = z
  .object({
    status: z.enum(["interested", "ignored"], {
      message: "Status must be interested or ignored",
    }),

    toUserId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  })
  .strict();

const reviewConnectionRequestParamsSchema = z
  .object({
    status: z.enum(["accepted", "rejected"], {
      message: "Status must be accepted or rejected",
    }),

    requestId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid connection request ID"),
  })
  .strict();

module.exports = {
  sendConnectionRequestParamsSchema,
  reviewConnectionRequestParamsSchema,
};
