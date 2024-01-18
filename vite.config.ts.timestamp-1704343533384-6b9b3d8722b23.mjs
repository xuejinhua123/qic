// vite.config.ts
import { defineConfig } from "file:///C:/Users/0174059/Desktop/code/XX/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/0174059/Desktop/code/XX/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///C:/Users/0174059/Desktop/code/XX/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/0174059/Desktop/code/XX/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///C:/Users/0174059/Desktop/code/XX/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var vite_config_default = defineConfig({
  base: "./",
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  // / 配置前端服务地址和端口
  server: {
    host: "0.0.0.0",
    //自定义主机名
    port: 8080
    //自定义端口
    // 是否开启 https
    // https: false,
  }
  // server: {
  //   proxy: {
  //     "/QCTable": { // “/api” 以及前置字符串会被替换为真正域名
  //       target: "http://147.121.223.2:8080/", // 请求域名
  //       secure: false, // 请求是否为https
  //       changeOrigin: true, // 是否跨域
  //       rewrite: (path) => path.replace(/^\/QCTable/, "")
  //     }
  //   }
  // }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwwMTc0MDU5XFxcXERlc2t0b3BcXFxcY29kZVxcXFxYWFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcMDE3NDA1OVxcXFxEZXNrdG9wXFxcXGNvZGVcXFxcWFhcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLzAxNzQwNTkvRGVza3RvcC9jb2RlL1hYL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZTogJy4vJyxcclxuICBwbHVnaW5zOiBbdnVlKCksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcclxuICAgIH0pLFxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIC8vIC8gXHU5MTREXHU3RjZFXHU1MjREXHU3QUVGXHU2NzBEXHU1MkExXHU1NzMwXHU1NzQwXHU1NDhDXHU3QUVGXHU1M0UzXHJcblx0c2VydmVyOiB7XHJcblx0ICBob3N0OiAnMC4wLjAuMCcsLy9cdTgxRUFcdTVCOUFcdTRFNDlcdTRFM0JcdTY3M0FcdTU0MERcclxuXHRcdHBvcnQ6IDgwODAsLy9cdTgxRUFcdTVCOUFcdTRFNDlcdTdBRUZcdTUzRTNcclxuXHRcdC8vIFx1NjYyRlx1NTQyNlx1NUYwMFx1NTQyRiBodHRwc1xyXG5cdFx0Ly8gaHR0cHM6IGZhbHNlLFxyXG5cdH0sXHJcbiAgLy8gc2VydmVyOiB7XHJcbiAgLy8gICBwcm94eToge1xyXG4gIC8vICAgICBcIi9RQ1RhYmxlXCI6IHsgLy8gXHUyMDFDL2FwaVx1MjAxRCBcdTRFRTVcdTUzQ0FcdTUyNERcdTdGNkVcdTVCNTdcdTdCMjZcdTRFMzJcdTRGMUFcdTg4QUJcdTY2RkZcdTYzNjJcdTRFM0FcdTc3MUZcdTZCNjNcdTU3REZcdTU0MERcclxuICAvLyAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzE0Ny4xMjEuMjIzLjI6ODA4MC9cIiwgLy8gXHU4QkY3XHU2QzQyXHU1N0RGXHU1NDBEXHJcbiAgLy8gICAgICAgc2VjdXJlOiBmYWxzZSwgLy8gXHU4QkY3XHU2QzQyXHU2NjJGXHU1NDI2XHU0RTNBaHR0cHNcclxuICAvLyAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1OERFOFx1NTdERlxyXG4gIC8vICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9RQ1RhYmxlLywgXCJcIilcclxuICAvLyAgICAgfVxyXG4gIC8vICAgfVxyXG4gIC8vIH1cclxufSlcclxuXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFIsU0FBUyxvQkFBb0I7QUFDM1QsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBRXBDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUFDLElBQUk7QUFBQSxJQUNaLFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxFQUNIO0FBQUE7QUFBQSxFQUVELFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBR1A7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
