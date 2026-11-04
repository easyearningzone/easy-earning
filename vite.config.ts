import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Dynamically discover all root and admin html entry points
  const rootHtml = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.html'))
    .reduce((acc, file) => {
      const name = file.replace('.html', '');
      acc[name] = path.resolve(__dirname, file);
      return acc;
    }, {} as Record<string, string>);

  const adminDir = path.resolve(__dirname, 'admin');
  const adminHtml = fs.existsSync(adminDir)
    ? fs.readdirSync(adminDir)
        .filter(file => file.endsWith('.html'))
        .reduce((acc, file) => {
          const name = 'admin_' + file.replace('.html', '');
          acc[name] = path.resolve(adminDir, file);
          return acc;
        }, {} as Record<string, string>)
    : {};

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          ...rootHtml,
          ...adminHtml,
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
