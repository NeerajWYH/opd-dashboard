import { NextResponse, type NextRequest } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { z } from "zod"
import { apiResponseSchema } from "@/lib/post-body-schema"
import { rateLimitMiddleware } from "@/lib/rate-limit"

export async function GET(
  request: NextRequest
): Promise<NextResponse<z.infer<typeof apiResponseSchema>>> {
  const rateLimitResponse = await rateLimitMiddleware()
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
    const docRef = await getDocs(collection(db, "medicinediscounts"))
    if (docRef.docs) {
      return NextResponse.json({
        success: true,
        message: "List fetched successfully",
        data: docRef.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      })
    }
    return NextResponse.json(
      { success: false, message: "Failed to fetch list", data: null },
      { status: 500 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
