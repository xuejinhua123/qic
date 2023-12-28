import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // / 配置前端服务地址和端口
	server: {
	  host: '0.0.0.0',//自定义主机名
		port: 8080,//自定义端口
		// 是否开启 https
		// https: false,
	},
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
})

