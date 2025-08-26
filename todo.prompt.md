# Todo List 專案開發提示詞（Pinia 版本）

## 目標
開發一個 Chrome extension，具備新增、編輯、刪除、完成狀態切換與摘要統計的待辦事項（Todo List）應用，使用 Pinia 進行狀態管理與元件化設計。

## 技術架構

### 狀態管理 - Pinia Store (todoStore.js)
- **狀態 (State)**：
  - `todoItems`：待辦事項列表陣列
  - 預設包含 4 筆資料：買牛奶、週日約會、週一會議、週二報告

- **計算屬性 (Getters)**：
  - `listSummary`：統計總數與完成數量的摘要

- **動作 (Actions)**：
  - `addTodo(newTodoLabel)`：新增待辦事項
  - `updateDoneStatus(todoId)`：切換完成狀態
  - `deleteTodo(todoId)`：刪除待辦事項
  - `editTodo(todoId, newLabel)`：編輯待辦事項內容

### 主要設定檔
- **main.js**：
  - 引入並配置 Pinia：`createPinia()`
  - 註冊 Pinia 到 Vue 應用：`app.use(pinia)`

## 元件架構與功能需求

### 1. App.vue（主要容器）
- **狀態管理**：
  - 使用 `useTodoStore()` 取得 Pinia store 實例
  - 移除本地狀態管理邏輯
  
- **Chrome 擴充功能整合**：
  - 監聽 `chrome.runtime.onMessage` 來接收網頁選取文字
  - 自動將選取文字新增為待辦事項

- **模板綁定**：
  - 使用 `todoStore.todoItems` 渲染待辦列表
  - 使用 `todoStore.listSummary` 顯示統計摘要
  - 事件處理直接綁定到 store 方法：
    - `@todo-add="todoStore.addTodo"`
    - `@checkbox-changed="todoStore.updateDoneStatus"`
    - `@item-deleted="todoStore.deleteTodo"`
    - `@item-edited="todoStore.editTodo"`

### 2. ToDoItem 元件
- **Props**：
  - `label`（字串）：待辦事項內容
  - `done`（布林）：是否完成
  - `id`（字串）：唯一標識符

- **事件 Emit**：
  - `@checkbox-changed`：傳遞 todoId 給父元件
  - `@item-deleted`：傳遞 todoId 給父元件
  - `@item-edited`：傳遞 todoId 和 newLabel 給父元件

- **本地狀態**：
  - `isEditing`：控制編輯模式切換

### 3. ToDoItemEditForm 元件
- **Props**：
  - `label`：原始標籤內容
  - `id`：待辦事項 ID

- **事件 Emit**：
  - `@item-edited`：編輯完成，傳遞新標籤
  - `@item-deleted`：刪除確認
  - `@close-edit-form`：關閉編輯表單

### 4. TodoForm 元件
- **本地狀態**：
  - `label`：輸入框綁定值

- **事件 Emit**：
  - `@todo-add`：傳遞新待辦事項標籤給父元件

## Chrome 擴充功能特性

### Content Script (content.js)
- 監聽網頁文字選取事件
- 使用 `chrome.runtime.sendMessage` 傳送選取文字到擴充功能
- 提供視覺反饋通知

### Manifest 配置
- 權限：`activeTab`, `scripting`
- Content scripts 注入到所有網頁：`<all_urls>`

## 資料流
1. **新增待辦**：TodoForm → emit → App.vue → todoStore.addTodo()
2. **狀態切換**：ToDoItem → emit → App.vue → todoStore.updateDoneStatus()
3. **編輯待辦**：ToDoItemEditForm → emit → ToDoItem → emit → App.vue → todoStore.editTodo()
4. **刪除待辦**：ToDoItem/ToDoItemEditForm → emit → App.vue → todoStore.deleteTodo()
5. **網頁選取**：content.js → chrome.runtime.sendMessage → App.vue → todoStore.addTodo()

## 優點
- **集中式狀態管理**：所有待辦事項狀態統一在 Pinia store 管理
- **響應式**：Pinia 提供響應式狀態，自動更新 UI
- **可維護性**：清晰的狀態管理邏輯，易於測試和除錯
- **可擴展性**：容易添加新功能如持久化、同步等
