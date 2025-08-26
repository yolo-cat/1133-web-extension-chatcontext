<template>
  <div class="todo-item">
    <el-card shadow="hover" :body-style="{ padding: '10px' }">
      <div v-if="!isEditing" class="item-content">
        <el-checkbox
          :model-value="done"
          @change="onCheckboxChanged"
          size="large"
        />
        <span :class="{ 'is-done': done }" class="item-label" @click="insertLabelToTab">{{ label }}</span>
        <div class="item-actions">
<!--          <el-button type="info" :icon="View" circle @click="goToDetail" />-->
<!--          <el-button type="primary" :icon="Edit" circle @click="isEditing = true" />-->
          <el-button type="danger" :icon="Delete" circle @click="onItemDeleted" />
        </div>
      </div>
      <ToDoItemEditForm
        v-else
        :id="id"
        :label="label"
        @item-edited="onItemEdited"
        @item-deleted="onItemDeleted"
        @close-edit-form="onCloseEditForm"
      />
    </el-card>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import ToDoItemEditForm from './ToDoItemEditForm.vue';
import { Edit, Delete, View } from '@element-plus/icons-vue';

export default {
  name: 'ToDoItem',
  components: {
    ToDoItemEditForm
  },
  props: {
    label: {
      type: String,
      required: true
    },
    done: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    }
  },
  emits: ['checkbox-changed', 'item-deleted', 'item-edited'],
  data() {
    return {
      isEditing: false,
      Edit: markRaw(Edit),
      Delete: markRaw(Delete),
      View: markRaw(View)
    }
  },
  methods: {
    onCheckboxChanged() {
      this.$emit('checkbox-changed', this.id);
    },
    onItemDeleted() {
      this.$emit('item-deleted', this.id);
    },
    onItemEdited(newLabel) {
      this.$emit('item-edited', this.id, newLabel);
      this.isEditing = false;
    },
    onCloseEditForm() {
      this.isEditing = false;
    },
    insertLabelToTab() {
      const label = this.label
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
    },
    goToDetail() {
      this.$router.push(`/todos/${this.id}`);
    }
  }
}
</script>

<style scoped>
.todo-item {
  margin-bottom: 10px;
}

.item-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.item-label {
  margin-left: 10px;
  flex-grow: 1;
  cursor: pointer;
  transition: color 0.3s;
}

.item-label:hover {
  color: #409EFF;
}

.item-label.is-done {
  text-decoration: line-through;
  color: #a8abb2;
}

.item-actions {
  margin-left: auto;
}
</style>
