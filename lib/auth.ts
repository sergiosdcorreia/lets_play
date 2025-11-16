export function setAuthCookie(token: string) {
  document.cookie = `auth-token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function removeAuthCookie() {
  document.cookie = "auth-token=; path=/; max-age=0";
}

export function getAuthCookie(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const authCookie = cookies.find((c) => c.trim().startsWith("auth-token="));

  return authCookie ? authCookie.split("=")[1] : null;
}
