<template>
  <div class="finished-todos-view">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>已完成事項</span>
          <el-text type="success" size="small">{{ finishedSummary }}</el-text>
        </div>
      </template>
      <div class="todo-list">
        <ToDoItem
          v-for="item in finishedTodos"
          :key="item.id"
          :id="item.id"
          :label="item.label"
          :done="item.done"
          @checkbox-changed="updateDoneStatus"
          @item-deleted="deleteTodo"
          @item-edited="editTodo"
        />
        <el-empty v-if="finishedTodos.length === 0" description="沒有已完成的事項" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { useTodoStore } from '../stores/todoStore.js'
import ToDoItem from '../components/ToDoItem.vue'

export default {
  name: 'FinishedTodosView',
  components: {
    ToDoItem
  },
  setup() {
    const todoStore = useTodoStore()

    return {
      todoStore
    }
  },
  computed: {
    finishedTodos() {
      // 確保 todoItems 是陣列
      const items = this.todoStore.todoItems || []
      return Array.isArray(items) ? items.filter(item => item.done) : []
    },
    finishedSummary() {
      return `已完成 ${this.finishedTodos.length} 個事項`
    }
  },
  methods: {
    updateDoneStatus(todoId) {
      this.todoStore.updateDoneStatus(todoId)
    },
    deleteTodo(todoId) {
      this.todoStore.deleteTodo(todoId)
    },
    editTodo(todoId, newLabel) {
      this.todoStore.editTodo(todoId, newLabel)
    }
  }
}
</script>

<style scoped>
.finished-todos-view {
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

.todo-list .el-card {
  margin-bottom: 10px;
}
</style>
