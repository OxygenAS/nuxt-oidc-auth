<script setup lang="ts">
import { onMounted, ref } from '#imports'

const { loggedIn, user, refresh, login, logout, currentProvider, clear } = useOidcAuth()
const { providers } = useProviders(currentProvider.value as string)
// const counter = ref(0)
// const checkAccessToken = async () => {return 
await $fetch('/api/getAccessToken', { method: 'Get' })
// }
//   await checkAccessToken()
// onMounted(async() => {
// })
// onMounted(() => {
//   if(loggedIn.value) {
//     checkAccessToken()
//   }
//   setInterval(() => {
//     counter.value++
//     console.log('counter', counter.value, loggedIn.value)
//     checkAccessToken()
//   }, 1000*60*10)
// })
</script>

<template>
  <div class="w-full grid grid-cols-2">
    <NuxtLink to="/test?test=hej">
      TEST Link
    </NuxtLink>
    <div class="col-start-1 flex flex-col gap-4 items-center">
      <p class="text-xl">
        Login with
      </p>
      <button
        class="btn-base btn-login"
        @click="login({ returnPath: '/test'})"
      >
        <span class="i-majesticons-login-line" />
        <span class="pl-2">Default provider</span>
      </button>
      <button
        v-for="(provider, index) in providers"
        :key="index"
        class="btn-base btn-login"
        :disabled="provider.disabled"
        @click="login({provider: provider.name})"
      >
        <span :class="provider.icon" />
        <span class="pl-2">{{ provider.label }}</span>
      </button>
      <p>Logged in: {{ loggedIn }}</p>
      <p>Current provider: {{ currentProvider }}</p>
      <button
        class="btn-base btn-login"
        :disabled="!loggedIn || !user.canRefresh"
        @click="refresh()"
      >
        <span class="i-majesticons-refresh" />
        <span class="pl-2">Refresh</span>
      </button>
      <!-- :disabled="!loggedIn" -->
      <button
        class="btn-base btn-login"
        @click="logout(currentProvider)"
      >
        <span class="i-majesticons-logout-line" />
        <span class="pl-2">Logout</span>
      </button>
      <button
        class="btn-base btn-login"
        :disabled="!loggedIn"
        @click="clear()"
      >
        <span class="i-majesticons-delete-bin-line" />
        <span class="pl-2">Clear session</span>
      </button>
    </div>
    <div class="col-start-2">
      <p class="pb-4 text-xl">
        User object
      </p>
      <div
        v-for="(value, key, index) in user"
        :key="index"
      >
        <span class="font-bold text-base">
          {{ `${key}` }}
        </span>
        <p class="text-sm pb-3 break-all">
          {{ value }}
        </p>
      </div>
    </div>
  </div>
</template>
