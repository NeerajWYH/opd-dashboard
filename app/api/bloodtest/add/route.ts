import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { z } from "zod"
import { bloodTestSchema, apiResponseSchema } from "@/lib/post-body-schema"
import { rateLimitMiddleware } from "@/lib/rate-limit"

const postBodySchema = bloodTestSchema.extend({
  dob: z.string(),
  createdAt: z.string(),
})

export async function POST(
  request: Request
): Promise<NextResponse<z.infer<typeof apiResponseSchema>>> {
  const rateLimitResponse = await rateLimitMiddleware(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  const clientKey = request.headers.get("client-key")
  if (!clientKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Client key is required",
        data: null,
      },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    let validatedData: z.infer<typeof postBodySchema>
    try {
      validatedData = postBodySchema.parse(body)
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            data: zodError.issues,
          },
          { status: 400 }
        )
      }
      throw zodError
    }
    const docRef = await addDoc(collection(db, "bloodtests"), validatedData)
    if (docRef.id) {
      return NextResponse.json({
        success: true,
        message: "Data received",
        data: docRef.id,
      })
    }
    return NextResponse.json(
      { success: false, message: "Failed to add document", data: null },
      { status: 500 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
