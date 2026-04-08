import * as z from "zod"

export const bloodTestSchema = z.object({
  fullname: z
    .string()
    .min(5, "Full name must be at least 5 characters.")
    .max(50, "Full name must be at most 50 characters."),
  dob: z.date(),
  gender: z.string().min(1, "Gender is required"),
  mobile: z
    .string()
    .refine(
      (value) => /^[6-9]\d{9}$/.test(value),
      "Mobile must be of 10 digits & should start with 6,7,8 or 9."
    ),
  address: z.string().max(200, "Address must be at most 200 characters."),
  notes: z.string().max(500, "Notes must be at most 500 characters."),
})

export const doctorConsultantSchema = z.object({
  fullname: z
    .string()
    .min(5, "Full name must be at least 5 characters.")
    .max(50, "Full name must be at most 50 characters."),
  dob: z.date(),
  gender: z.string().min(1, "Gender is required"),
  mobile: z
    .string()
    .refine(
      (value) => /^[6-9]\d{9}$/.test(value),
      "Mobile must be of 10 digits & should start with 6,7,8 or 9."
    ),
  address: z.string().max(200, "Address must be at most 200 characters."),
  currentIllness: z
    .string()
    .max(500, "Current illness  must be at most 500 characters."),
})

export const multiSpecialistSchema = z.object({
  fullname: z
    .string()
    .min(5, "Full name must be at least 5 characters.")
    .max(50, "Full name must be at most 50 characters."),
  dob: z.date(),
  gender: z.string().min(1, "Gender is required"),
  mobile: z
    .string()
    .refine(
      (value) => /^[6-9]\d{9}$/.test(value),
      "Mobile must be of 10 digits & should start with 6,7,8 or 9."
    ),
  specialist: z.string().min(1, "Specialist is required"),
  address: z.string().max(200, "Address must be at most 200 characters."),
  currentIllness: z
    .string()
    .max(500, "Current illness must be at most 500 characters."),
})

export const medicalEvacuationSchema = z.object({
  fullname: z
    .string()
    .min(5, "Full name must be at least 5 characters.")
    .max(50, "Full name must be at most 50 characters."),
  dob: z.date(),
  gender: z.string().min(1, "Gender is required"),
  mobile: z
    .string()
    .refine(
      (value) => /^[6-9]\d{9}$/.test(value),
      "Mobile must be of 10 digits & should start with 6,7,8 or 9."
    ),
  emergencytype: z.string().min(1, "Emergency type is required"),
  address: z.string().max(200, "Address must be at most 200 characters."),
  explainemergency: z
    .string()
    .max(500, "Explain emergency must be at most 500 characters."),
})

export function exposeFormattedStringifyAPISchema(schemaShape: any) {
  const refinedSchema = JSON.parse(JSON.stringify(schemaShape, null, 2))
  const updatedSchema: Record<string, string> = {}
  Object.keys(refinedSchema).forEach((key) => {
    updatedSchema[key] = refinedSchema[key].type
  })
  updatedSchema.createdAt = "date string"
  if (updatedSchema.dob) {
    updatedSchema.dob = "date string"
  }
  return JSON.stringify(updatedSchema, null, 2)
}
