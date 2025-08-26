// Chrome 擴展儲存工具類
export class ChromeExtensionStorage {
  constructor(storageKey = 'todolist_extension_data') {
    this.storageKey = storageKey
    this.isExtension = this.checkIfExtension()
  }

  // 檢查是否在Chrome擴展環境中運行
  checkIfExtension() {
    return window.chrome && chrome.storage && chrome.storage.local
  }

  // 保存數據（優先使用Chrome Storage API，回退到localStorage）
  async save(data) {
    const saveData = {
      todos: data,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }

    try {
      if (this.isExtension) {
        // 使用Chrome Storage API
        await chrome.storage.local.set({ [this.storageKey]: saveData })
        console.log('數據已保存到Chrome擴展儲存')
      } else {
        // 回退到localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(saveData))
        console.log('數據已保存到本地儲存')
      }
    } catch (error) {
      console.error('保存數據失敗:', error)
      // 如果Chrome Storage失敗，嘗試localStorage
      if (this.isExtension) {
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(saveData))
          console.log('已回退到本地儲存')
        } catch (fallbackError) {
          console.error('回退儲存也失敗:', fallbackError)
        }
      }
    }
  }

  // 讀取數據
  async load() {
    try {
      if (this.isExtension) {
        // 使用Chrome Storage API
        const result = await chrome.storage.local.get([this.storageKey])
        const data = result[this.storageKey]
        if (data) {
          console.log('從Chrome擴展儲存載入數據:', data.timestamp)
          return data.todos || []
        }
      } else {
        // 使用localStorage
        const savedData = localStorage.getItem(this.storageKey)
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          console.log('從本地儲存載入數據:', parsedData.timestamp)
          return parsedData.todos || []
        }
      }
    } catch (error) {
      console.error('讀取數據失敗:', error)
      // 如果Chrome Storage失敗，嘗試localStorage
      if (this.isExtension) {
        try {
          const savedData = localStorage.getItem(this.storageKey)
          if (savedData) {
            const parsedData = JSON.parse(savedData)
            console.log('已回退讀取本地儲存:', parsedData.timestamp)
            return parsedData.todos || []
          }
        } catch (fallbackError) {
          console.error('回退讀取也失敗:', fallbackError)
        }
      }
    }
    return null
  }

  // 清除儲存的數據
  async clear() {
    try {
      if (this.isExtension) {
        await chrome.storage.local.remove([this.storageKey])
        console.log('Chrome擴展儲存已清除')
      } else {
        localStorage.removeItem(this.storageKey)
        console.log('本地儲存已清除')
      }
    } catch (error) {
      console.error('清除數據失敗:', error)
    }
  }

  // 獲取儲存統計信息
  async getStorageStats() {
    try {
      if (this.isExtension) {
        const bytesInUse = await chrome.storage.local.getBytesInUse()
        const quota = chrome.storage.local.QUOTA_BYTES || 5242880 // 5MB
        return {
          used: bytesInUse,
          quota: quota,
          percentage: Math.round((bytesInUse / quota) * 100)
        }
      } else {
        // localStorage 估算
        const data = localStorage.getItem(this.storageKey)
        const used = data ? new Blob([data]).size : 0
        const quota = 5 * 1024 * 1024 // 估算5MB
        return {
          used: used,
          quota: quota,
          percentage: Math.round((used / quota) * 100)
        }
      }
    } catch (error) {
      console.error('獲取儲存統計失敗:', error)
      return { used: 0, quota: 0, percentage: 0 }
    }
  }

  // 匯出數據為JSON檔案
  async exportToFile() {
    try {
      const data = await this.load()
      if (data) {
        const jsonString = JSON.stringify({
          todos: data,
          exportDate: new Date().toISOString(),
          version: '1.0',
          source: this.isExtension ? 'chrome-extension' : 'web-app'
        }, null, 2)

        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `todolist_backup_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        console.log('數據已匯出為JSON檔案')
        return true
      }
    } catch (error) {
      console.error('匯出數據失敗:', error)
      return false
    }
  }

  // 從JSON檔案匯入數據
  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.todos && Array.isArray(data.todos)) {
            resolve(data.todos)
          } else {
            reject(new Error('無效的JSON格式：缺少todos陣列'))
          }
        } catch (error) {
          reject(new Error('JSON解析失敗：' + error.message))
        }
      }
      reader.onerror = () => reject(new Error('檔案讀取失敗'))
      reader.readAsText(file)
    })
  }

  // 監聽儲存變化（僅Chrome擴展）
  onStorageChanged(callback) {
    if (this.isExtension && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes[this.storageKey]) {
          callback(changes[this.storageKey].newValue, changes[this.storageKey].oldValue)
        }
      })
    }
  }

  // 同步數據到其他Chrome擴展標籤頁
  async syncToAllTabs() {
    if (this.isExtension && chrome.tabs) {
      try {
        const data = await this.load()
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            if (tab.url && tab.url.includes('chrome-extension://')) {
              chrome.tabs.sendMessage(tab.id, {
                action: 'syncTodoData',
                data: data
              }).catch(() => {
                // 忽略無法連接的標籤頁
              })
            }
          })
        })
      } catch (error) {
        console.error('同步數據失敗:', error)
      }
    }
  }
}
