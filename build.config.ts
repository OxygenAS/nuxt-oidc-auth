import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'defu',
    'h3',
    'scule',
    'ofetch',
    'ufo',
    'uncrypto',
    'unstorage',
    '#imports',
    '@nuxt/schema',
  ],
  failOnWarn: false,
  rollup: {
    emitCJS: false,
  },
  hooks: {
    'mkdist:entry:options'(_ctx, _entry, mkdistOptions) {
      mkdistOptions.ext = 'mjs'
    },
  },
})
