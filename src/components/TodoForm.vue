<template>
  <el-form @submit.prevent="onSubmit" :inline="true">
    <!-- 隱藏label="新的待辦事項"區塊 -->
    <el-form-item>
      <el-input
        v-model.lazy.trim="label"
        placeholder="Add anything to ChatContext"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" :icon="Plus">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { markRaw } from 'vue'
import { Plus } from '@element-plus/icons-vue';

export default {
  name: 'TodoForm',
  emits: ['todo-add'],
  data() {
    return {
      label: "",
      Plus: markRaw(Plus)
    }
  },
  methods: {
    onSubmit() {
      if (this.label) {
        this.$emit('todo-add', this.label);
        this.label = "";
      }
    }
  }
}
</script>
