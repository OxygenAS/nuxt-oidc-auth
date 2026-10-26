import { useOidcAuth, defineNuxtRouteMiddleware } from "#imports";
export default defineNuxtRouteMiddleware(async (to) => {
  const oidcAuth = to.meta.oidcAuth;
  if (oidcAuth?.enabled === false) {
    return;
  }
  const isErrorPage = !(to.matched.length > 0);
  if (isErrorPage) {
    return;
  }
  const { loggedIn, login } = useOidcAuth();
  if (loggedIn.value === true || to.path.startsWith("/auth")) {
    return;
  }
  await login();
});
