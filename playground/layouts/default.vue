<script setup lang="ts">
</script>

<template>
  <div
    class="relative h-100dvh flex flex-col bg-base font-base justify-center items-center divide-y text-center divide-gray-400"
  >
    <div class="py-8 text-2xl">
      <p>
        Nuxt OIDC Auth
      </p>
    
    </div>
    <main
      class="flex-1 w-full overflow-y-auto p-4 dark:(from-brand-blue via-brand-blue to-brand-blueDark bg-gradient-to-tr) sm:px-8 sm:py-6"
    >
      <slot />
    </main>
  </div>
</template>
