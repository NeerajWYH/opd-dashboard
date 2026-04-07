import { loader } from "@/hooks/use-loader"
import { triggerToast } from "@/lib/utils"

interface RequestConfig extends RequestInit {
  params?: Record<string, string>
}

interface HttpResponse<T> {
  data: T | null
  status: number
  ok: boolean
  error?: string
}

const BASE_URL = process.env.NEXT_API_BASE_URL ?? ""

let activeRequests = 0

async function httpRequest<T>(
  method: string,
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
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

    const response = await fetch(fullUrl, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...init,
    })

    const data = (await response.json().catch(() => null)) as T | null

    if (!response.ok) {
      const message =
        ((data as Record<string, unknown>)?.message as string) ??
        response.statusText ??
        "Something went wrong"
      triggerToast("error", message)
      return { data: null, status: response.status, ok: false, error: message }
    }

    return { data, status: response.status, ok: true }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error. Please try again."
    triggerToast("error", message)
    return { data: null, status: 0, ok: false, error: message }
  } finally {
    activeRequests--
    if (activeRequests === 0) {
      loader.hide()
    }
  }
}

function httpGet<T>(
  url: string,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  return httpRequest<T>("GET", url, undefined, config)
}

function httpPost<T>(
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  return httpRequest<T>("POST", url, body, config)
}

function httpPut<T>(
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  return httpRequest<T>("PUT", url, body, config)
}

function httpDelete<T>(
  url: string,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  return httpRequest<T>("DELETE", url, undefined, config)
}

export { httpGet, httpPost, httpPut, httpDelete }
export type { RequestConfig, HttpResponse }
