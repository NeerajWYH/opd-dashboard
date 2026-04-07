import * as z from "zod"

export const bloodTestSchema = z.object({
  fullname: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(50, "Bug title must be at most 50 characters."),
  dob: z.date(),
  gender: z.string(),
  mobile: z
    .string()
    .refine(
      (value) => /^[6-9]\d{9}$/.test(value),
      "Mobile must be of 10 digits & should start with 6,7,8 or 9."
    ),
  address: z.string().max(200, "Address must be at most 100 characters."),
  notes: z.string().max(200, "Notes must be at most 100 characters."),
})
