import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { z } from "zod"
import { medicalEvacuationSchema } from "@/lib/post-body-schema"
import { rateLimitMiddleware } from "@/lib/rate-limit"

const postBodySchema = medicalEvacuationSchema.extend({
  dob: z.string(),
  createdAt: z.string(),
})

export async function POST(request: Request) {
  const rateLimitResponse = await rateLimitMiddleware(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await request.json()
    let validatedData: z.infer<typeof postBodySchema>
    try {
      validatedData = postBodySchema.parse(body)
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: zodError.issues },
          { status: 400 }
        )
      }
      throw zodError
    }
    const docRef = await addDoc(
      collection(db, "medicalevacuations"),
      validatedData
    )
    if (docRef.id) {
      return NextResponse.json({
        received: docRef.id,
        message: "Data received",
      })
    }
    return NextResponse.json(
      { error: "Failed to add document" },
      { status: 500 }
    )
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
