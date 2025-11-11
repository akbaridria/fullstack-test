import { refreshToken } from "./auth";

const BASE_URL = "http://localhost:3000";

export async function fetchClient(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> {
  const url = endpoint.startsWith("http") ? endpoint : BASE_URL + endpoint;
  const isProtected = options.credentials === "include";

  const res = await fetch(url, options);

  if (res.status === 401 && isProtected && retry) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return fetchClient(endpoint, options, false);
    }
    throw new Error("Unauthorized");
  }

  return res;
}
