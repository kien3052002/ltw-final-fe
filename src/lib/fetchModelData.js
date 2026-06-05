const BASE_URL = "";

export default async function fetchModel(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof body === "string" ? body : body.error || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return body;
}
