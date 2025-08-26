<template>
  <el-form @submit.prevent="onSubmit" :inline="true" class="edit-form">
    <el-form-item class="edit-form__input">
      <el-input v-model.lazy.trim="newLabel" />
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" native-type="submit" :icon="Check">儲存</el-button>
        <el-button type="danger" @click="onDelete" :icon="Delete">刪除</el-button>
        <el-button @click="onCancel" :icon="Close">取消</el-button>
      </el-button-group>
    </el-form-item>
  </el-form>
</template>

<script>
import { markRaw } from 'vue'
import { Check, Delete, Close } from '@element-plus/icons-vue';

export default {
  name: 'ToDoItemEditForm',
  props: {
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  emits: ['item-edited', 'item-deleted', 'close-edit-form'],
  data() {
    return {
      newLabel: this.label,
      Check: markRaw(Check),
      Delete: markRaw(Delete),
      Close: markRaw(Close)
    }
  },
  methods: {
    onSubmit() {
      if (this.newLabel && this.newLabel !== this.label) {
        this.$emit('item-edited', this.newLabel);
      }
      this.$emit('close-edit-form'); // Always close after submit
    },
    onDelete() {
      this.$emit('item-deleted');
    },
    onCancel() {
      this.$emit('close-edit-form');
    }
  }
}
</script>

<style scoped>
.edit-form {
  display: flex;
  width: 100%;
  align-items: center;
}
.edit-form__input {
  flex-grow: 1;
  margin-right: 10px;
}
</style>
