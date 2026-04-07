import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { z } from "zod"
import { bloodTestSchema } from "@/lib/post-body-schema"

const postBodySchema = bloodTestSchema.extend({
  dob: z.string(),
})

export async function POST(request: Request) {
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
    const docRef = await addDoc(collection(db, "bloodtests"), validatedData)
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
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
