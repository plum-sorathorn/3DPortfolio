import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/howler')) {
            return 'vendor-howler';
          }
        },
      },
    },
  },
});
