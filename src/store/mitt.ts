// 可以在项目目录utils下封装一个event.js
import mitt from 'mitt'
const bus = mitt()
export default bus
