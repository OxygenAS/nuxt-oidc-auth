import { useState, computed, useCookie, useRequestFetch, navigateTo, useRoute } from "#imports";
const useSessionState = () => useState("nuxt-oidc-auth-session", void 0);
export const useOidcAuth = () => {
  const sessionState = useSessionState();
  const user = computed(() => sessionState.value || void 0);
  const loggedIn = computed(() => {
    return Boolean(sessionState.value);
  });
  const currentProvider = computed(() => sessionState.value?.provider || void 0);
  async function fetch() {
    useSessionState().value = await useRequestFetch()("/api/_auth/session", {
      headers: {
        Accept: "text/json"
      }
    }).catch(() => void 0);
  }
  async function refresh() {
    await $fetch("/api/_auth/refresh", { method: "POST" });
    await fetch();
  }
  async function login(provider) {
    const cookie = useCookie("login-return-path");
    const route = useRoute();
    cookie.value = { path: route.path, query: route.params };
    await navigateTo(`/auth${provider ? "/" + provider : ""}/login`, { external: true, redirectCode: 302 });
  }
  async function logout(provider) {
    await navigateTo(
      `/auth${provider ? "/" + provider : ""}/logout`,
      {
        external: true
      }
    );
  }
  async function clear() {
    await useRequestFetch()("/api/_auth/session", {
      method: "DELETE",
      headers: {
        Accept: "text/json"
      }
    });
  }
  return {
    loggedIn,
    user,
    currentProvider,
    fetch,
    refresh,
    login,
    logout,
    clear
  };
};
