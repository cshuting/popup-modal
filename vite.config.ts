import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jsxResolver from "@vitejs/plugin-vue-jsx";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    jsxResolver({
      /**
       * 禁用在标签内部使用对象形式的slots
       *
       * 请使用v-slots使用具名插槽
       */
      enableObjectSlots: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 7019,
    host: "0.0.0.0",
  },
});
