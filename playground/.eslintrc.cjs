module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
  ],
  rules: {
    // Global
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/quote-props': ['error', 'as-needed'],
    'quote-props': 'off',
    quotes: 'off',
    // Vue
    'vue/multi-word-component-names': 0,
    'vue/max-attributes-per-line': 'off',
    'vue/no-v-html': 0,
  },
}
