// vite.config.js
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'src/index.js',
            output: {
                entryFileNames: 'bundle.js',
            },
        },
    },
    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11'],
        }),
        {
            ...terser(),
            apply: 'build',
            enforce: 'post',
        },
    ],
});
