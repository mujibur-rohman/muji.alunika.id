"use client";

import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
}

export function removeAuthToken() {
  Cookies.remove(TOKEN_KEY);
}
