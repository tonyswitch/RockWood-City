import { decodeToken } from "./login";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `sb_wiz.zpc.ng.${host}-${window.location.pathname}`;
const TOKEN_BUFFER_MS = 1000 * 60 * 60 * 4;

export const getToken = () => {
  const token =
    new URLSearchParams(window.location.search).get("token") ||
    getSocialSession();

  if (token) {
    const decoded = decodeToken(token);

    const isFresh = decoded.exp * 1000 > Date.now() + TOKEN_BUFFER_MS;

    if (isFresh) {
      return token;
    }

    removeSocialSession();
    return null;
  }

  return null;
};

export function getSocialSession(): string | null {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!item) {
    return null;
  }

  return JSON.parse(item);
}

export function saveSocialSession(token: string) {
  return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(token));
}

export function removeSocialSession() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
