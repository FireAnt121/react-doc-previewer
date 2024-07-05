import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tsConfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'
import * as packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      include: ['packages/index.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: resolve('packages', 'index.tsx'),
      name: 'ReactDocPreviewer',
      formats: ['es', 'umd'],
      fileName: (format) => `react-doc-previewer.${format}.js`
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
})
