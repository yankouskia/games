import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/games/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
