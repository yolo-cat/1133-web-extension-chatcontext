import { defineStore } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'
import { ChromeExtensionStorage } from '../utils/ChromeExtensionStorage.js'

export const useTodoStore = defineStore('todo', () => {
  // 初始化Chrome擴展優化的離線儲存
  const storage = new ChromeExtensionStorage()

  // 預設數據
  const defaultTodos = [
    // { id: 'todo-' + crypto.randomUUID(), label: '買牛奶', done: false, createdAt: new Date().toISOString() },
    // { id: 'todo-' + crypto.randomUUID(), label: '週日約會', done: false, createdAt: new Date().toISOString() },
    // { id: 'todo-' + crypto.randomUUID(), label: '週一會議', done: true, createdAt: new Date().toISOString() },
    // { id: 'todo-' + crypto.randomUUID(), label: '週二報告', done: false, createdAt: new Date().toISOString() }
  ]

  // 初始化狀態
  const todoItems = ref([])
  const isLoading = ref(true)
  const storageStats = ref({ used: 0, quota: 0, percentage: 0 })

  // 防抖相關變數
  let saveTimeoutId = null
  let isSaving = ref(false)

  // 初始化數據載入
  const initializeData = async () => {
    try {
      isLoading.value = true
      const loadedTodos = await storage.load()

      // 確保 todoItems 始終是陣列
      if (Array.isArray(loadedTodos)) {
        todoItems.value = loadedTodos
      } else {
        console.log('No valid todos loaded, using default todos')
        todoItems.value = [...defaultTodos]
      }

      await updateStorageStats()
    } catch (error) {
      console.error('初始化數據失敗:', error)
      todoItems.value = [...defaultTodos]
    } finally {
      isLoading.value = false
    }
  }

  // 更新儲存統計
  const updateStorageStats = async () => {
    try {
      storageStats.value = await storage.getStorageStats()
    } catch (error) {
      console.error('更新儲存統計失敗:', error)
    }
  }

  // 防抖保存函數
  const debouncedSave = async (todos) => {
    // 清除之前的定時器
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId)
    }

    // 設置新的定時器，300ms 後執行保存
    saveTimeoutId = setTimeout(async () => {
      if (!isLoading.value && !isSaving.value) {
        try {
          isSaving.value = true
          console.log('正在保存數據到 storage，共', todos.length, '個項目')
          await storage.save(todos)
          await updateStorageStats()
          console.log('數據保存成功')
        } catch (error) {
          console.error('保存數據失敗:', error)
        } finally {
          isSaving.value = false
        }
      }
    }, 300)
  }

  // 監聽todoItems變化，使用防抖自動保存
  watch(todoItems, async (newTodos) => {
    if (!isLoading.value) {
      await debouncedSave([...newTodos])
    }
  }, { deep: true })

  // 設置儲存變化監聽（Chrome擴展環境）
  storage.onStorageChanged((newValue, oldValue) => {
    if (newValue && newValue.todos && Array.isArray(newValue.todos)) {
      console.log('檢測到其他標籤頁的數據變化，正在同步...')
      // 暫時停止監聽，避免循環觸發
      isLoading.value = true
      todoItems.value = newValue.todos
      nextTick(() => {
        isLoading.value = false
      })
    }
  })

  // 計算屬性
  const listSummary = computed(() => {
    const total = todoItems.value.length
    const done = todoItems.value.filter(item => item.done).length
    return `總共 ${total} 個項目，已完成 ${done} 個。`
  })

  // 動作
  // 區塊編號優先順序
  // const categoryList = ['draft', 'explain', 'analyze', 'summary']
    const categoryList = ['explain', 'analyze', 'summary']

    // 可選：每區最大容量（如有需求可設，否則不限制）
  // const maxPerCategory = 10

  function addTodo(newTodoLabel) {
    // 依序尋找第一個可用的 category
    let targetCategory = 'draft'
    for (const cat of categoryList) {
      // 若有最大容量限制，需判斷
      // const count = todoItems.value.filter(item => item.category === cat).length
      // if (count < maxPerCategory) {
      //   targetCategory = cat
      //   break
      // }
      // 無容量限制，直接分配到第一個 category
      targetCategory = cat
      break
    }
    const newTodo = {
      id: 'todo-' + crypto.randomUUID(),
      label: newTodoLabel,
      done: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: targetCategory
    }
    todoItems.value.push(newTodo)
    console.log('新增待辦事項:', newTodoLabel, '分配到:', targetCategory, '當前總數:', todoItems.value.length)
  }

  function setTodoCategory(todoId, category) {
    const todo = todoItems.value.find(item => item.id === todoId)
    if (todo) {
      todo.category = category
      todo.updatedAt = new Date().toISOString()
    }
  }

  const todosByCategory = computed(() => {
    return {
      draft: todoItems.value.filter(item => item.category === 'draft'),
      explain: todoItems.value.filter(item => item.category === 'explain'),
      analyze: todoItems.value.filter(item => item.category === 'analyze'),
      summary: todoItems.value.filter(item => item.category === 'summary')
    }
  })

  function updateDoneStatus(todoId) {
    const todo = todoItems.value.find(item => item.id === todoId)
    if (todo) {
      todo.done = !todo.done
      todo.updatedAt = new Date().toISOString()
    }
  }

  function deleteTodo(todoId) {
    todoItems.value = todoItems.value.filter(item => item.id !== todoId)
  }

  function editTodo(todoId, newLabel) {
    const todo = todoItems.value.find(item => item.id === todoId)
    if (todo) {
      todo.label = newLabel
      todo.updatedAt = new Date().toISOString()
    }
  }

  // 資料管理功能
  async function clearAllData() {
    todoItems.value = []
    await storage.clear()
    await updateStorageStats()
  }

  function resetToDefault() {
    todoItems.value = [...defaultTodos]
  }

  async function exportData() {
    return await storage.exportToFile()
  }

  async function importData(file) {
    try {
      const importedTodos = await storage.importFromFile(file)
      // 為匯入的數據添加缺失的時間戳
      const processedTodos = importedTodos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt || new Date().toISOString(),
        updatedAt: todo.updatedAt || new Date().toISOString()
      }))
      todoItems.value = processedTodos
      return true
    } catch (error) {
      console.error('匯入數據失敗:', error)
      throw error
    }
  }

  // 手動保存數據
  async function saveToStorage() {
    await storage.save(todoItems.value)
    await updateStorageStats()
  }

  // 手動載入數據
  async function loadFromStorage() {
    const loadedData = await storage.load()
    if (Array.isArray(loadedData)) {
      todoItems.value = loadedData
    } else {
      console.log('Invalid data loaded, keeping current todos')
    }
    await updateStorageStats()
  }

  // 同步到所有標籤頁
  async function syncToAllTabs() {
    await storage.syncToAllTabs()
  }

  // 初始化
  initializeData()

  return {
    todoItems,
    isLoading,
    storageStats,
    listSummary,
    initializeData,
    addTodo,
    updateDoneStatus,
    deleteTodo,
    editTodo,
    clearAllData,
    resetToDefault,
    exportData,
    importData,
    saveToStorage,
    loadFromStorage,
    syncToAllTabs,
    updateStorageStats,
    setTodoCategory,
    todosByCategory
  }
})
