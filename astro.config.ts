import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'
// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: 'always'
  },
  compressHTML: true,
  prefetch: true,
  devToolbar: {
    enabled: false
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
  output: 'server'
})
