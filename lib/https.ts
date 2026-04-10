import { loader } from "@/hooks/use-loader"
import { triggerToast } from "@/lib/utils"
import { z } from "zod"
import { apiResponseSchema } from "@/lib/post-body-schema"

interface RequestConfig extends RequestInit {
  params?: Record<string, string>
}

const BASE_URL = process.env.NEXT_API_BASE_URL ?? ""

let activeRequests = 0

async function httpRequest(
  method: string,
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<z.infer<typeof apiResponseSchema>> {
  activeRequests++
  if (activeRequests === 1) {
    loader.show()
  }

  try {
    const { params, headers: customHeaders, ...init } = config ?? {}

    let fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`

    if (params) {
      const searchParams = new URLSearchParams(params)
      fullUrl += `?${searchParams.toString()}`
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(customHeaders as Record<string, string>),
    }

    // console.log(headers, !headers["client-key"])

    if (!headers["client-key"]) {
      return { data: null, success: false, message: "Client keys is required" }
    }

    const response = await fetch(fullUrl, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...init,
    })

    const res = (await response.json().catch(() => null)) as z.infer<
      typeof apiResponseSchema
    >

    if (!response.ok) {
      const message =
        ((res as Record<string, unknown>)?.message as string) ??
        response.statusText ??
        "Something went wrong"
      triggerToast("error", message)
      // return { data: null, status: response.status, ok: false, error: message }
      return { data: null, success: false, message: message }
    }

    return { data: res?.data, success: res?.success, message: res?.message }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error. Please try again."
    triggerToast("error", message)
    return { data: null, success: false, message: message }
  } finally {
    activeRequests--
    if (activeRequests === 0) {
      loader.hide()
    }
  }
}

function httpGet(
  url: string,
  config?: RequestConfig
): Promise<z.infer<typeof apiResponseSchema>> {
  return httpRequest("GET", url, undefined, config)
}

function httpPost<T>(
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<z.infer<typeof apiResponseSchema>> {
  return httpRequest("POST", url, body, config)
}

function httpPut<T>(
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<z.infer<typeof apiResponseSchema>> {
  return httpRequest("PUT", url, body, config)
}

function httpDelete<T>(
  url: string,
  config?: RequestConfig
): Promise<z.infer<typeof apiResponseSchema>> {
  return httpRequest("DELETE", url, undefined, config)
}

export { httpGet, httpPost, httpPut, httpDelete }
export type { RequestConfig }
