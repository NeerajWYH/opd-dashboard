import rateLimit from "express-rate-limit"
import { NextResponse } from "next/server"
import { z } from "zod"
import { apiResponseSchema } from "./post-body-schema"

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests. Please try again later.",
  keyGenerator: (request) => {
    return (
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"
    )
  },
})

export async function rateLimitMiddleware(
  request?: Request
): Promise<NextResponse<z.infer<typeof apiResponseSchema>> | null> {
  return new Promise<NextResponse<z.infer<typeof apiResponseSchema>> | null>(
    (resolve) => {
      const mockReq = {
        headers: request?.headers,
      } as any

      const mockRes = {
        statusCode: 200,
        setHeader: () => {},
        end: () => {},
      } as any

      const originalEnd = mockRes.end
      mockRes.end = function (body?: any) {
        if (this.statusCode === 429) {
          resolve(
            NextResponse.json(
              {
                success: false,
                message: "Too many requests. Please try again later.",
                data: null,
              },
              { status: 429 }
            )
          )
        } else {
          resolve(null)
        }
        originalEnd.call(this, body)
      }

      limiter(mockReq, mockRes, () => {
        resolve(null)
      })
    }
  )
}
