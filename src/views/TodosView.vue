<template>
  <div class="todos-view">
    <!-- 清單摘要區塊隱藏
    <el-card class="box-card" style="margin-bottom: 20px;">
      <template #header>
        <div class="card-header">
          <span>清單摘要</span>
          <el-text type="info" size="small">{{ listSummary }}</el-text>
        </div>
      </template>
    </el-card>
    -->
<!--    <el-card class="box-card">-->
<!--      <template #header>-->
<!--        <div class="card-header">-->
<!--          <span>新增事項</span>-->
<!--        </div>-->
<!--      </template>-->
<!--      <TodoForm @todo-add="addTodo" />-->
<!--    </el-card>-->

    <div class="todo-categories todo-stack">
      <!-- 暫存區完全隱藏，以下區塊移除 -->
      <!--
      <el-card class="category-card">
        <template #header>
        </template>
        <draggable
          :list="todosByCategory.draft"
          group="todos"
          @change="onDragChange('draft', $event)"
          item-key="id"
        >
          <template #item="{ element }">
            <ToDoItem
              :id="element.id"
              :label="element.label"
              :done="element.done"
              @checkbox-changed="updateDoneStatus"
              @item-deleted="deleteTodo"
              @item-edited="editTodo"
            />
          </template>
        </draggable>
      </el-card>
      -->
      <el-card class="category-card">
        <template #header>
          <el-button type="primary" size="small" @click="sendLabelToTab('#解釋')">#解釋</el-button>
        </template>
        <draggable
          :list="todosByCategory.explain"
          group="todos"
          @change="onDragChange('explain', $event)"
          item-key="id"
        >
          <template #item="{ element }">
            <ToDoItem
              :id="element.id"
              :label="element.label"
              :done="element.done"
              @checkbox-changed="updateDoneStatus"
              @item-deleted="deleteTodo"
              @item-edited="editTodo"
            />
          </template>
        </draggable>
      </el-card>
      <el-card class="category-card">
        <template #header>
          <el-button type="primary" size="small" @click="sendLabelToTab('#分析')">#分析</el-button>
        </template>
        <draggable
          :list="todosByCategory.analyze"
          group="todos"
          @change="onDragChange('analyze', $event)"
          item-key="id"
        >
          <template #item="{ element }">
            <ToDoItem
              :id="element.id"
              :label="element.label"
              :done="element.done"
              @checkbox-changed="updateDoneStatus"
              @item-deleted="deleteTodo"
              @item-edited="editTodo"
            />
          </template>
        </draggable>
      </el-card>
      <el-card class="category-card">
        <template #header>
          <el-button type="primary" size="small" @click="sendLabelToTab('#總結')">#總結</el-button>
        </template>
        <draggable
          :list="todosByCategory.summary"
          group="todos"
          @change="onDragChange('summary', $event)"
          item-key="id"
        >
          <template #item="{ element }">
            <ToDoItem
              :id="element.id"
              :label="element.label"
              :done="element.done"
              @checkbox-changed="updateDoneStatus"
              @item-deleted="deleteTodo"
              @item-edited="editTodo"
            />
          </template>
        </draggable>
      </el-card>
    </div>
  </div>
</template>

<script>
import { useTodoStore } from '../stores/todoStore.js'
import ToDoItem from '../components/ToDoItem.vue'
import TodoForm from '../components/TodoForm.vue'
import draggable from 'vuedraggable'

export default {
  name: 'TodosView',
  components: {
    ToDoItem,
    TodoForm,
    draggable
  },
  setup() {
    const todoStore = useTodoStore()
    return {
      todoStore
    }
  },
  computed: {
    todosByCategory() {
      return this.todoStore.todosByCategory
    },
    listSummary() {
      return this.todoStore.listSummary
    }
  },
  methods: {
    addTodo(newTodoLabel) {
      this.todoStore.addTodo(newTodoLabel)
    },
    updateDoneStatus(todoId) {
      this.todoStore.updateDoneStatus(todoId)
    },
    deleteTodo(todoId) {
      this.todoStore.deleteTodo(todoId)
    },
    editTodo(todoId, newLabel) {
      this.todoStore.editTodo(todoId, newLabel)
    },
    onDragChange(newCategory, evt) {
      // 跨區拖動時，正確移除/新增並排序
      if (evt.added && evt.added.element && evt.added.element.id) {
        const itemId = evt.added.element.id
        const item = this.todoStore.todoItems.find(t => t.id === itemId)
        if (item) {
          // 更新 category
          item.category = newCategory
          item.updatedAt = new Date().toISOString()
          // 先移除
          const oldIndex = this.todoStore.todoItems.findIndex(t => t.id === itemId)
          this.todoStore.todoItems.splice(oldIndex, 1)
          // 計算目標插入位置
          const targetIds = this.todosByCategory[newCategory].map(t => t.id)
          let insertIndex = this.todoStore.todoItems.findIndex(t => t.id === targetIds[evt.added.newIndex])
          if (insertIndex === -1) insertIndex = this.todoStore.todoItems.length
          this.todoStore.todoItems.splice(insertIndex, 0, item)
        }
      }
    },
    sendLabelToTab(label) {
      if (window.chrome && chrome.tabs && chrome.runtime) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          const tab = tabs[0]
          if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('extension://')) {
            this.$message.warning('請在一般網頁（如 chatgpt.com）上使用此功能')
            return
          }
          chrome.tabs.sendMessage(
            tab.id,
            { action: 'insertLabel', label },
            (response) => {
              if (response && response.success) {
                this.$message.success('已插入到網頁欄位')
              } else {
                this.$message.warning('插入失敗或找不到欄位')
              }
            }
          )
        })
      } else {
        this.$message.warning('請在 Chrome 擴展環境下使用')
      }
    }
  }
}
</script>

<style scoped>
.todos-view {
  padding: 10px;
}
.todo-categories {
  margin-top: 20px;
}
.todo-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.category-card {
  min-height: 200px;
  width: 100%;
}
</style>
