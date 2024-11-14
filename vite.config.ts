import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: "mdformat",
      async resolveId(id) {
        if (id.endsWith('.md')) {
          return id;
        }
      },
      async load(id) {
        if (id.endsWith('.md')) {
          const filePath = path.resolve(id);
          const fileContent = await fs.readFileSync(filePath, 'utf-8');
          return `const data = ${JSON.stringify(fileContent)}; \n export default data`;
        }
      },
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
