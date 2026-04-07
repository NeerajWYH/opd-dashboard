"use client"

import { useState } from "react"

export default function ApiTestPage() {
  const [response, setResponse] = useState<string | null>(null)

  const testGet = async () => {
    const res = await fetch("/api/hello")
    const data = await res.json()
    setResponse(JSON.stringify(data, null, 2))
  }

  const testPost = async () => {
    const res = await fetch("/api/hello", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test User" }),
    })
    const data = await res.json()
    setResponse(JSON.stringify(data, null, 2))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">API Test</h2>
      <div className="flex gap-2">
        <button
          onClick={testGet}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Test GET
        </button>
        <button
          onClick={testPost}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Test POST
        </button>
      </div>
      {response && (
        <pre className="rounded bg-gray-100 p-4 text-sm text-black">
          {response}
        </pre>
      )}
    </div>
  )
}
