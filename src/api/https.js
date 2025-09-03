const BASE_URL = "https://kdt-api.fe.dev-cos.com";
const USERNAME = "team_404";

function withHeaders(options = {}) {
  const base = {
    "Content-Type": "application/json",
  };
  const username = { "x-username": USERNAME };
  return {
    ...options,
    headers: { ...base, ...username, ...(options.headers || {}) },
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, withHeaders(options));

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

export const http = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
