import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL ?? 'https://username.github.io';
const base = process.env.BASE_PATH ?? '/portfolio';

export default defineConfig({
  site,
  base,
  output: 'static',
  outDir: './dist',
  vite: {
    plugins: [tailwindcss()],
  },
});
