const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token")

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}),

        ...options?.headers
      }
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Wystąpił błąd serwera"
    }))

    throw new Error(error.message)
  }

  return response.json()
}