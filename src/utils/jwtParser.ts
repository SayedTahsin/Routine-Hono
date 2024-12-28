export function extractEmailFromToken(token: string): string {
  if (!token) return "";

  const parts = token.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return "";

  const jwtToken = parts[1];

  const jwtParts = jwtToken.split(".");
  if (jwtParts.length !== 3) return "";

  const payload = jwtParts[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = atob(base64);

  const parsedPayload = JSON.parse(jsonPayload);

  if (!parsedPayload.email || typeof parsedPayload.email !== "string") {
    return "";
  }

  return parsedPayload.email;
}
