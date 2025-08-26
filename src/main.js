import './assets/reset.css'
import './assets/main.css'
import './assets/resize-observer-fix.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// 處理 ResizeObserver 錯誤
const resizeObserverErrorHandler = (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    // 這是一個已知的良性錯誤，不影響功能
    return true
  }
  return false
}

// 捕獲 ResizeObserver 錯誤
window.addEventListener('error', (e) => {
  if (resizeObserverErrorHandler(e)) {
    e.preventDefault()
  }
})

// 捕獲未處理的 Promise rejection
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
    e.preventDefault()
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 添加全局錯誤處理器
app.config.errorHandler = (err, vm, info) => {
  if (err.message && err.message.includes('ResizeObserver')) {
    // 忽略 ResizeObserver 相關錯誤
    return
  }
  console.error('Vue Error:', err, info)
}

app.mount('#app')
