# Vue 3 / Nuxt 3 Development Skill

## Composition API
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  productId: string
  initialQuantity?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialQuantity: 1
})

const emit = defineEmits<{
  (e: 'update:quantity', value: number): void
  (e: 'add-to-cart', id: string, qty: number): void
}>()

const quantity = ref(props.initialQuantity)
const isValid = computed(() => quantity.value > 0)

function addToCart() {
  if (isValid.value) {
    emit('add-to-cart', props.productId, quantity.value)
  }
}
</script>

<template>
  <div class="product-quantity">
    <input v-model.number="quantity" type="number" class="product-quantity__input">
    <button class="product-quantity__button" :disabled="!isValid" @click="addToCart">
      Add to Cart
    </button>
  </div>
</template>

<style lang="scss" scoped>
.product-quantity {
  &__input { }
  &__button { }
}
</style>
```

## BEM Naming
```scss
.product-card {
  &__image { }
  &__title { }
  &__price { }
  &--featured { }
}
```

## Pinia State Management
```typescript
export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  
  const activeProducts = computed(() => 
    products.value.filter(p => p.isActive)
  )
  
  async function fetchProducts() {
    loading.value = true
    const { data } = await useFetch('/api/products')
    products.value = data.value ?? []
    loading.value = false
  }
  
  return { products, loading, activeProducts, fetchProducts }
})
```

## Composables
```typescript
export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  watch(value, (newValue) => {
    setTimeout(() => debouncedValue.value = newValue, delay)
  })
  return debouncedValue
}
```

## GSAP Animations
```typescript
import gsap from 'gsap'

onMounted(() => {
  gsap.from('.fade-in', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.1
  })
})
```

## SSR Memory Safety ⚠️ CRITICAL

### Rule 1: Never Use Module-Level Reactive State
```typescript
// ❌ WRONG - Memory leak: state persists across all SSR requests
const results = ref([])
const loading = ref(false)

export function useSearch() {
  return { results, loading }
}

// ✅ CORRECT - Use useState for SSR-safe shared state
export function useSearch() {
  const results = useState('search-results', () => [])
  const loading = useState('search-loading', () => false)
  return { results, loading }
}
```

**Why this matters:** In SSR, module-level variables persist across ALL requests, causing memory leaks.

### Rule 2: Never Store Functions in useState
```typescript
// ❌ WRONG - Functions cannot be serialized
const loginPromise = useState('login-promise', () => null)
loginPromise.value = someAsyncFunction() // BREAKS SSR

// ✅ CORRECT - Store serializable data only
const loginData = useState('login-data', () => null)
const data = await someAsyncFunction()
loginData.value = data
```

### Rule 3: Client-Only Watchers
```typescript
// ❌ WRONG - Runs on both server and client
watch(() => state.value, () => {
  // This runs during SSR and accumulates memory
})

// ✅ CORRECT - Client-only watchers
if (import.meta.client) {
  watch(() => state.value, () => {
    // Only runs in browser
  })
}
```

### Rule 4: Clean Up Event Listeners
```typescript
// ❌ WRONG - No cleanup
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

// ✅ CORRECT - With cleanup
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// ✅ BETTER - Use VueUse (auto-cleanup)
useEventListener(window, 'resize', handleResize)
```

## Nuxt Auto-Imports

**DO NOT import these** (Nuxt auto-imports them):
```typescript
// ❌ WRONG
import { ref, computed, watch } from 'vue'
import { useFetch } from '#app'

// ✅ CORRECT - Just use them directly
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

Auto-imported by Nuxt:
- All Vue APIs: `ref`, `computed`, `watch`, `onMounted`, `provide`, `inject`, etc.
- Nuxt composables: `useFetch`, `useState`, `useRoute`, `useRouter`, etc.
- All files in `composables/` directory
- All files in `components/` directory

## Template Conventions

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>()
</script>

<template>
  <!-- ❌ WRONG - Never use props. prefix in templates -->
  <h1>{{ props.title }}</h1>

  <!-- ✅ CORRECT - Direct access -->
  <h1>{{ title }}</h1>
</template>
```

## Component Naming Patterns

```
Base*      → Reusable base components (BaseButton, BaseModal)
*Block     → CMS content blocks (HeroBlock, TextBlock, ImageBlock)
*Item      → List item components (NewsItem, EventItem, ProductItem)
*Form      → Form components (ContactForm, RegistrationForm)
*Card      → Card-style components (ProductCard, ArticleCard)
```

## Data Fetching Patterns

```typescript
// For server API routes - use $fetch
const data = await $fetch('/api/content', {
  query: { id: contentId }
})

// For component data - use useFetch (SSR-compatible)
const { data, pending, error } = await useFetch('/api/content', {
  query: { id: contentId }
})

// Server-only data fetching
if (import.meta.server) {
  const serverData = await fetchSensitiveData()
}

// Client-only operations
if (import.meta.client) {
  // Browser-only code (local storage, window, etc.)
}
```

## Server API Routes (Nitro)

**Naming convention:** `name.method.ts`

```typescript
// server/api/form/submit.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { apiUrl } = useRuntimeConfig()

  try {
    const response = await $fetch(`${apiUrl}/endpoint`, {
      method: 'POST',
      body
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to process request'
    })
  }
})
```

## Translation Pattern

```typescript
// ❌ WRONG - Hardcoded text
const buttonText = "Submit"

// ✅ CORRECT - Translation keys
const { t } = useTranslation()
const buttonText = t('UI.Buttons.Submit')
```

## Logging Pattern

```typescript
const { logInfo, logError } = useLogger()

try {
  await processData()
  logInfo('Data processed successfully', { recordId })
} catch (error) {
  logError('Failed to process data', {
    error: error.message,
    recordId,
    context: 'processData'
  })
}
```

## Best Practices
- Composition API only (no Options API)
- TypeScript strict mode
- BEM for CSS naming
- Pinia for state management
- Props with runtime validation
- Explicit emits
- Lazy load routes
- Virtual scrolling for large lists
- **Always use `useState` for shared composable state**
- **Never store functions or non-serializable values in `useState`**
- **Run watchers only on client side**
- **Clean up event listeners in `onUnmounted`**
- **Never import Vue APIs or composables (auto-imported)**
- **Never use `props.` prefix in templates**
- **Never hardcode text - use translation keys**
