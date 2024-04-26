// 公共变量
const Serve_IP = '10.160.25.105' // http://147.121.223.2/ 147.121.223.9 147.121.223.2  147.121.171.249 10.160.25.66
const Serve_IP_FILE = '10.160.25.105' // http://147.121.223.2/ 147.121.223.9 147.121.223.2
const Serve_sock = 8080

export const SERVER_URL = 'http://' + Serve_IP + ':' + Serve_sock  // 后端地址
export const SERVER_URL_FILE = `http://${Serve_IP_FILE}:8848` // 上传图片用到的后端地址
export const SERVER_URL_SHOW_IMG = `http://${Serve_IP_FILE}` // 显示图片

export const PDF_URL = 'http://10.160.25.105' // 显示PDF
// export const SERVER_URL_SHOW_IMG = `http://147.121.223.2` // 显示图片

export const SERVER_URL_TEST = `http://147.121.223.2:8848` // 测试
