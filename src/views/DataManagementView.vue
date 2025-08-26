<template>
  <div class="data-management-view">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>資料管理</span>
          <el-text type="info" size="small">離線儲存 & 備份功能</el-text>
        </div>
      </template>

      <div class="management-section">
        <h3>備份與恢復</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>匯出資料</span>
              </template>
              <p>將所有待辦事項匯出為JSON檔案</p>
              <el-button type="primary" @click="handleExport" :loading="exportLoading">
                <el-icon><Download /></el-icon>
                匯出備份
              </el-button>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>匯入資料</span>
              </template>
              <p>從JSON檔案恢復待辦事項</p>
              <el-upload
                ref="uploadRef"
                :auto-upload="false"
                :show-file-list="false"
                accept=".json"
                :on-change="handleFileChange"
              >
                <el-button type="success">
                  <el-icon><Upload /></el-icon>
                  選擇檔案
                </el-button>
              </el-upload>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <el-divider />

      <div class="management-section">
        <h3>儲存狀態</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="總事項數">{{ totalCount }}</el-descriptions-item>
          <el-descriptions-item label="已完成數">{{ completedCount }}</el-descriptions-item>
          <el-descriptions-item label="最後更新">{{ lastUpdateTime }}</el-descriptions-item>
          <el-descriptions-item label="儲存狀態">
            <el-tag type="success" v-if="!todoStore.isLoading">已同步</el-tag>
            <el-tag type="warning" v-else>載入中...</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="儲存使用量">
            <el-progress
              :percentage="todoStore.storageStats.percentage"
              :color="getStorageColor(todoStore.storageStats.percentage)"
            />
            <span class="storage-text">
              {{ formatBytes(todoStore.storageStats.used) }} / {{ formatBytes(todoStore.storageStats.quota) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="儲存類型">
            <el-tag :type="storageType.type">{{ storageType.text }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-divider />

      <div class="management-section">
        <h3>資料操作</h3>
        <el-space wrap>
          <el-button @click="handleManualSave" :loading="saveLoading">
            <el-icon><DocumentCopy /></el-icon>
            手動保存
          </el-button>

          <el-button @click="handleReload" :loading="todoStore.isLoading">
            <el-icon><Refresh /></el-icon>
            重新載入
          </el-button>

          <el-button type="info" @click="handleSyncTabs">
            <el-icon><Connection /></el-icon>
            同步標籤頁
          </el-button>

          <el-button type="warning" @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置為預設
          </el-button>

          <el-button type="danger" @click="handleClearAll">
            <el-icon><Delete /></el-icon>
            清除所有資料
          </el-button>
        </el-space>
      </div>

      <el-divider />

      <div class="management-section">
        <h3>JSON 格式預覽</h3>
        <el-card class="json-preview">
          <pre>{{ jsonPreview }}</pre>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { useTodoStore } from '../stores/todoStore.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Download,
  Upload,
  DocumentCopy,
  Refresh,
  RefreshLeft,
  Delete,
  Connection
} from '@element-plus/icons-vue'

export default {
  name: 'DataManagementView',
  components: {
    Download,
    Upload,
    DocumentCopy,
    Refresh,
    RefreshLeft,
    Delete,
    Connection
  },
  data() {
    return {
      exportLoading: false,
      saveLoading: false,
      selectedFile: null
    }
  },
  setup() {
    const todoStore = useTodoStore()
    return { todoStore }
  },
  computed: {
    totalCount() {
      const items = this.todoStore.todoItems || []
      return Array.isArray(items) ? items.length : 0
    },
    completedCount() {
      const items = this.todoStore.todoItems || []
      return Array.isArray(items) ? items.filter(item => item.done).length : 0
    },
    lastUpdateTime() {
      const items = this.todoStore.todoItems || []
      if (!Array.isArray(items) || items.length === 0) return '無'

      const lastUpdate = items.reduce((latest, todo) => {
        const todoTime = new Date(todo.updatedAt || todo.createdAt)
        return todoTime > latest ? todoTime : latest
      }, new Date(0))

      return lastUpdate.toLocaleString('zh-TW')
    },
    jsonPreview() {
      const items = this.todoStore.todoItems || []
      const sampleData = {
        todos: Array.isArray(items) ? items.slice(0, 2).map(todo => ({
          id: todo.id,
          label: todo.label,
          done: todo.done,
          createdAt: todo.createdAt,
          updatedAt: todo.updatedAt
        })) : [],
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
      return JSON.stringify(sampleData, null, 2)
    },
    storageType() {
      const { used, quota } = this.todoStore.storageStats
      const percentage = (used / quota) * 100

      let type = 'success'
      let text = '正常'

      if (percentage > 80) {
        type = 'warning'
        text = '接近上限'
      }
      if (percentage > 90) {
        type = 'danger'
        text = '已達上限'
      }

      return { type, text }
    }
  },
  methods: {
    async handleExport() {
      this.exportLoading = true
      try {
        const success = this.todoStore.exportData()
        if (success) {
          ElMessage.success('資料匯出成功！')
        } else {
          ElMessage.error('匯出失敗，請稍後再試')
        }
      } catch (error) {
        ElMessage.error('匯出過程中發生錯誤')
      } finally {
        this.exportLoading = false
      }
    },

    handleFileChange(file) {
      this.selectedFile = file.raw
      this.confirmImport()
    },

    async confirmImport() {
      if (!this.selectedFile) return

      try {
        await ElMessageBox.confirm(
          '匯入新資料將覆蓋現有的所有待辦事項，確定要繼續嗎？',
          '確認匯入',
          {
            confirmButtonText: '確定匯入',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        await this.todoStore.importData(this.selectedFile)
        ElMessage.success('資料匯入成功！')
        this.selectedFile = null
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('匯入失敗：' + error.message)
        }
      }
    },

    async handleManualSave() {
      this.saveLoading = true
      try {
        this.todoStore.saveToStorage()
        ElMessage.success('資料已手動保存')
      } catch (error) {
        ElMessage.error('保存失敗')
      } finally {
        this.saveLoading = false
      }
    },

    handleReload() {
      try {
        this.todoStore.loadFromStorage()
        ElMessage.success('資料已重新載入')
      } catch (error) {
        ElMessage.error('載入失敗')
      }
    },

    async handleSyncTabs() {
      this.saveLoading = true
      try {
        await this.todoStore.syncWithTabs()
        ElMessage.success('已同步其他標籤頁的資料')
      } catch (error) {
        ElMessage.error('同步失敗：' + error.message)
      } finally {
        this.saveLoading = false
      }
    },

    async handleReset() {
      try {
        await ElMessageBox.confirm(
          '將重置為預設的待辦事項，現有資料將被清除，確定要繼續嗎？',
          '確認重置',
          {
            confirmButtonText: '確定重置',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        this.todoStore.resetToDefault()
        ElMessage.success('已重置為預設資料')
      } catch (error) {
        // 使用者取消
      }
    },

    async handleClearAll() {
      try {
        await ElMessageBox.confirm(
          '將清除所有待辦事項和本地儲存，此操作無法恢復，確定要繼續嗎？',
          '確認清除',
          {
            confirmButtonText: '確定清除',
            cancelButtonText: '取消',
            type: 'danger'
          }
        )

        this.todoStore.clearAllData()
        ElMessage.success('所有資料已清除')
      } catch (error) {
        // 使用者取消
      }
    },

    formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    getStorageColor(percentage) {
      if (percentage <= 80) return '#67C23A'
      if (percentage <= 90) return '#E6A23C'
      return '#F56C6C'
    }
  }
}
</script>

<style scoped>
.data-management-view {
  max-width: 800px;
  margin: 40px auto;
}

.box-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.management-section {
  margin-bottom: 20px;
}

.management-section h3 {
  color: #409EFF;
  margin-bottom: 15px;
  font-size: 18px;
}

.json-preview {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.json-preview pre {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #333;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  white-space: pre-wrap;
}

.storage-text {
  display: inline-block;
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}
</style>
