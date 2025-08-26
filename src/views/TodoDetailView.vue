<template>
  <div class="todo-detail-view">
    <el-card class="box-card" v-if="todo">
      <template #header>
        <div class="card-header">
          <span>事項詳情</span>
          <el-button @click="goBack" size="small">返回</el-button>
        </div>
      </template>
      <div class="todo-detail">
        <el-descriptions :column="1" border>
          <!-- <el-descriptions-item label="ID">{{ todo.id }}</el-descriptions-item> -->
          <el-descriptions-item label="內容">{{ todo.label }}</el-descriptions-item>
          <el-descriptions-item label="狀態">
            <el-tag :type="todo.done ? 'success' : 'warning'">
              {{ todo.done ? '已完成' : '待處理' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="actions">
          <el-button
            :type="todo.done ? 'warning' : 'success'"
            @click="toggleStatus"
          >
            {{ todo.done ? '標記為未完成' : '標記為已完成' }}
          </el-button>
          <el-button type="primary" @click="startEdit">編輯</el-button>
          <el-button type="danger" @click="confirmDelete">刪除</el-button>
        </div>

        <!-- 編輯模式 -->
        <el-dialog v-model="editDialogVisible" title="編輯事項" width="500px">
          <el-form :model="editForm">
            <el-form-item label="內容">
              <el-input v-model="editForm.label" placeholder="請輸入事項內容" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveEdit">保存</el-button>
          </template>
        </el-dialog>
      </div>
    </el-card>

    <el-card v-else class="box-card">
      <el-empty description="找不到此事項" />
      <el-button @click="goBack">返回列表</el-button>
    </el-card>
  </div>
</template>

<script>
import { useTodoStore } from '../stores/todoStore.js'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'TodoDetailView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editDialogVisible: false,
      editForm: {
        label: ''
      }
    }
  },
  setup() {
    const todoStore = useTodoStore()

    return {
      todoStore
    }
  },
  computed: {
    todo() {
      return this.todoStore.todoItems.find(item => item.id === this.id)
    }
  },
  methods: {
    goBack() {
      this.$router.push('/todos')
    },
    toggleStatus() {
      this.todoStore.updateDoneStatus(this.id)
      ElMessage.success(this.todo.done ? '已標記為已完成' : '已標記為未完成')
    },
    startEdit() {
      this.editForm.label = this.todo.label
      this.editDialogVisible = true
    },
    saveEdit() {
      if (this.editForm.label.trim()) {
        this.todoStore.editTodo(this.id, this.editForm.label.trim())
        this.editDialogVisible = false
        ElMessage.success('事項已更新')
      }
    },
    async confirmDelete() {
      try {
        await ElMessageBox.confirm(
          '確定要刪除此事項嗎？',
          '確認刪除',
          {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        this.todoStore.deleteTodo(this.id)
        ElMessage.success('事項已刪除')
        this.goBack()
      } catch {
        // 使用者取消刪除
      }
    }
  }
}
</script>

<style scoped>
.todo-detail-view {
  max-width: 680px;
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

.todo-detail {
  padding: 20px 0;
}

.actions {
  margin-top: 20px;
  text-align: center;
}

.actions .el-button {
  margin: 0 10px;
}
</style>
