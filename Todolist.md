# Todolist 專案開發任務

## 階段一：元件建立與 props/data 定義

- [ ] 建立 `src/components/ToDoItem.vue`
    - [ ] 定義 `props`: `label` (String), `done` (Boolean)
    - [ ] 定義 `data`: `id` (String, 'todo' + UUID), `isDone` (Boolean)
- [ ] 建立 `src/components/ToDoItemEditForm.vue`
    - [ ] 定義 `props`: `label` (String), `id` (String)
- [ ] 建立 `src/components/TodoForm.vue`
    - [ ] 建立 `label`, `input`, `button` 元素

## 階段二：功能與事件實現

- [ ] **ToDoItem.vue**
    - [ ] `v-model` 雙向綁定待辦事項內容
    - [ ] `@checkbox-changed` 事件：切換完成狀態
    - [ ] `@item-deleted` 事件：刪除待辦事項
    - [ ] `@item-edited` 事件：編輯待辦事項
    - [ ] `v-if`/`v-else` 控制顯示/編輯模式
- [ ] **ToDoItemEditForm.vue**
    - [ ] `v-model` 雙向綁定待辦事項內容
    - [ ] `@item-edited` 事件：編輯完成
    - [ ] `@item-deleted` 事件：刪除
    - [ ] `@close-edit-form` 事件：關閉編輯表單
    - [ ] `v-if`/`v-else` 控制表單顯示
- [ ] **TodoForm.vue**
    - [ ] `v-model` 綁定輸入框 (含 `.lazy` 與 `.trim` 修飾符)
    - [ ] `@submit` 事件觸發 `addTodo` 方法
    - [ ] `addTodo` 方法檢查輸入並觸發 `@todo-add` 事件

## 階段三：主應用程式 (App.vue) 整合

- [ ] 在 `App.vue` 中引入 `ToDoItem`, `ToDoItemEditForm`, `TodoForm`
- [ ] 管理待辦事項列表 (含 4 筆預設資料)
- [ ] 使用 `v-for` 渲染列表，並綁定 `key`
- [ ] 處理 `@checkbox-changed`, `@item-deleted`, `@item-edited`, `@todo-add` 事件
- [ ] 建立 `addTodo` 與 `updateDoneStatus` 方法
- [ ] 建立計算屬性 `doneCount` 與 `totalCount`
- [ ] 顯示摘要資訊

## 階段四：樣式與全域設定

- [ ] 建立 `src/assets/reset.css` 並定義全域樣式重置
- [ ] 在 `src/main.js` 中引入 `reset.css`
- [ ] 使用 flex 將內容置中
