<script setup>
import { useTodoStore } from './stores/todoStore.js'
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'

// 使用 Pinia store
const todoStore = useTodoStore()

// 懸浮球顯示狀態
// const showFloatingBall = ref(true)

// 註冊 Chrome 擴充訊息監聽
onMounted(async () => {
  console.log('TodoList Extension: Vue app mounted, setting up message listener...')

  // 初始化載入事項資料，確保每次啟動都從 storage 載入
  try {
    await todoStore.initializeData()
    console.log('TodoList Extension: Store data initialized successfully')
  } catch (error) {
    console.error('TodoList Extension: Failed to initialize store data:', error)
  }

  if (window.chrome && chrome.runtime && chrome.runtime.onMessage) {
    console.log('TodoList Extension: Chrome runtime available, setting up message listener')

    // 處理pending todos（popup開啟時處理之前儲存的待辦事項）
    checkAndProcessPendingTodos()

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('TodoList Extension: Received message in popup:', message)
      console.log('TodoList Extension: Sender info:', sender)

      if (message.action === 'addTodo' && message.text) {
        console.log('TodoList Extension: Processing addTodo request for:', message.text)

        try {
          // 確保store已經初始化
          if (todoStore.addTodo) {
            todoStore.addTodo(message.text)
            console.log('TodoList Extension: Todo added successfully to store')
            console.log('TodoList Extension: Current todos count:', todoStore.todoItems.length)

            // 發送成功確認
            const response = {
              success: true,
              message: 'Added',
              todoCount: todoStore.todoItems.length
            }

            console.log('TodoList Extension: Sending response:', response)
            sendResponse(response)

            // 顯示成功提示
            ElMessage.success(`Added：${message.text.substring(0, 20)}${message.text.length > 20 ? '...' : ''}`)

            // 如果訊息來自background，發送確認到content script
            if (message.fromBackground && sender.tab) {
              chrome.tabs.sendMessage(sender.tab.id, {
                action: 'todoAdded',
                text: message.text
              }).catch((error) => {
                console.log('TodoList Extension: Could not send confirmation to content script:', error.message)
              })
            }

          } else {
            throw new Error('Todo store not properly initialized')
          }
        } catch (error) {
          console.error('TodoList Extension: Error adding todo:', error)
          const errorResponse = {
            success: false,
            error: error.message
          }
          sendResponse(errorResponse)
          ElMessage.error('add fail：' + error.message)
        }
      }

      // 重要：保持訊息通道開啟以支援異步回應
      return true
    })

    console.log('ChatContext Extension: Message listener registered successfully')
  } else {
    console.warn('ChatContext Extension: Chrome runtime not available - running in web mode')
  }
})

// 檢查並處理pending todos
function checkAndProcessPendingTodos() {
  if (chrome && chrome.storage) {
    chrome.storage.local.get(['pendingTodos'], (result) => {
      const pendingTodos = result.pendingTodos || []
      console.log('ChatContext Extension: Found pending todos:', pendingTodos.length)

      if (pendingTodos.length > 0) {
        let processedCount = 0

        // 處理所有pending todos
        pendingTodos.forEach((pendingTodo, index) => {
          if (!pendingTodo.processed) {
            console.log('ChatContext Extension: Processing pending todo:', pendingTodo.text)
            todoStore.addTodo(pendingTodo.text)
            pendingTodos[index].processed = true
            processedCount++
          }
        })

        // 清除已處理的pending todos
        const unprocessedTodos = pendingTodos.filter(todo => !todo.processed)
        chrome.storage.local.set({ pendingTodos: unprocessedTodos }, () => {
          console.log('ChatContext Extension: Pending todos processed and cleaned up')
          if (processedCount > 0) {
            ElMessage.success(`已處理 ${processedCount} 個待辦事項`)
          }
        })
      }
    })
  }
}

// 關閉懸浮球方法
// function closeFloatingBall() {
//   showFloatingBall.value = false
//   // 通知父頁（content script）關閉懸浮球
//   if (window.parent !== window) {
//     window.parent.postMessage({ type: 'CLOSE_FLOATING_BALL' }, '*');
//   }
// }
//
// function openFloatingBall() {
//   showFloatingBall.value = true
//   // 可根據需求通知父頁顯示懸浮球（如有需要）
// }

</script>

<template>
  <el-container id="app-container">
    <el-header class="app-header">
      <h1>ChatContext</h1>
<!--      <el-button-->
<!--        v-if="showFloatingBall"-->
<!--        type="danger"-->
<!--        size="small"-->
<!--        style="position:absolute;top:18px;right:24px;z-index:2000;"-->
<!--        @click="closeFloatingBall"-->
<!--      >關閉懸浮球</el-button>-->
<!--      <el-button-->
<!--        v-else-->
<!--        type="primary"-->
<!--        size="small"-->
<!--        style="position:absolute;top:18px;right:24px;z-index:2000;"-->
<!--        @click="openFloatingBall"-->
<!--      >顯示懸浮球</el-button>-->
<!--      <nav class="nav-menu">-->
<!--        <el-menu mode="horizontal" :default-active="$route.path" router>-->
<!--          <el-menu-item index="/todos">所有事項</el-menu-item>-->
<!--          <el-menu-item index="/todos/finished">已完成</el-menu-item>-->
<!--          <el-menu-item index="/data-management">資料管理</el-menu-item>-->
<!--        </el-menu>-->
<!--      </nav>-->
    </el-header>
<!--    <el-main>-->
      <router-view />
<!--    </el-main>-->
  </el-container>
</template>

<style>
#app-container {
  max-width: 800px;
  margin: 20px auto;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '\5FAE\8F6F\96C5\9ED1', Arial, sans-serif;
  /* 防止 ResizeObserver 錯誤的 CSS 修復 */
  contain: layout style paint;
  will-change: auto;
}

.app-header {
  text-align: center;
  padding: 20px 0;
  /* 穩定化 header 尺寸 */
  min-height: 80px;
}

.app-header h1 {
  color: #409EFF;
  margin-bottom: 20px;
  /* 防止文字引起的尺寸變化 */
  line-height: 1.2;
}

.nav-menu {
  display: flex;
  justify-content: center;
  /* 穩定化導航菜單 */
  min-height: 60px;
}

.nav-menu .el-menu {
  border-bottom: none;
  /* 防止動態尺寸變化 */
  flex-shrink: 0;
}

/* 全局 Element Plus 組件修復 */
.el-card {
  /* 防止卡片組件引起的 ResizeObserver 錯誤 */
  contain: layout;
}

.el-menu-item {
  /* 穩定化菜單項目尺寸 */
  min-width: 80px;
}

/* 防止滾動條引起的尺寸變化 */
.el-main {
  overflow-x: hidden;
}
</style>
