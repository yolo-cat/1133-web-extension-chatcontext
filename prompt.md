# Todo List 專案開發提示詞（Prompt）

## 目標
開發一個 Chrome extension，具備新增、編輯、刪除、完成狀態切換與摘要統計的待辦事項（Todo List）應用，並採用元件化設計與事件傳遞。

## 元件與功能需求

### 1. ToDoItem 元件
- props：
  - `label`（字串）：待辦事項內容。
  - `done`（布林）：是否完成。
- data：
  - `id`：唯一標識符（格式：todo+UUID）。
  - `isDone`：布林，表示完成狀態。
- 雙向綁定：
  - `v-model` 綁定待辦事項內容。
- 事件：
  - `@checkbox-changed`：切換完成狀態。
  - `@item-deleted`：刪除待辦事項。
  - `@item-edited`：編輯待辦事項。
- 條件渲染：
  - `v-if`/`v-else` 控制顯示內容或編輯表單。

### 2. ToDoItemEditForm 元件
- 用於編輯 ToDoItem 內容。
- props：
  - `label`、`id`
- 雙向綁定：
  - `v-model` 綁定待辦事項內容。
- 事件：
  - `@item-edited`：編輯完成。
  - `@item-deleted`：刪除。
  - `@close-edit-form`：關閉編輯表單。
- 條件渲染：
  - `v-if`/`v-else` 控制表單顯示。

### 3. TodoForm 元件
- 元素：`label`、`input`、`button`
- 雙向綁定：
  - `v-model` 綁定輸入框，使用 lazy/trim 修飾符。
- 事件：
  - `@submit`：提交表單。
  - `addTodo` 方法：檢查輸入、觸發 `todo-add` 事件並清空輸入框。

### 4. App.vue
- 使用 ToDoItem、ToDoItemEditForm、TodoForm 元件。
- 管理待辦事項列表（預設 4 筆：買牛奶、週日約會、週一會議、週二報告）。
- 使用 `v-for` 渲染列表，`key` 綁定唯一 id。
- 事件處理：
  - `@checkbox-changed`、`@item-deleted`、`@item-edited`、`@todo-add`。
  - 方法：`addTodo`、`updateDoneStatus`。
- 計算屬性：
  - `doneCount`：已完成數量。
  - `totalCount`：總數量。
- 顯示摘要。

### 5. 樣式重置
- 建立 `src/assets/reset.css`，定義全局樣式重置。
- 在 `src/main.js` 引入 `reset.css`。
- 使用 flex 置中。

## 技術重點
- Vue 3 元件化設計
- props、data、computed、事件傳遞
- v-model 雙向綁定
- 條件渲染與列表渲染
- 樣式重置與全局樣式管理

---

**請根據以上規格逐步開發，確保每個元件與功能皆符合要求。**

