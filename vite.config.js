import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base:
    process.env.NODE_ENV === "production"
      ? "https://agricolajkb.github.io/spiegel-morse"
      : "/",
});
