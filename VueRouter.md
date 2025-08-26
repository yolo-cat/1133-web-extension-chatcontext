`元件都使用 options API 格式`

`事件名稱要用英文`

## 安裝 Vue Router

```bash
npm install vue-router@4
```

## main.js 註冊 Vue Router

## 路由設計

- `/todos`：顯示所有待辦事項
- `/todos/finished`：顯示已完成事項
- `/todos/:id`：單一事項詳細頁

## 元件設計

TodoList.vue

```markdown
新增 TodoList.vue 路由元件
template
包含 ToDoForm 元件用於新增待辦事項
顯示所有待辦事項列表，使用 TodoItem 元件

script
管理所有待辦事項的資料
監聽 ToDoForm 的 **資料新增** 事件
監聽 TodoItem 的 **checkbox變更**、**清單編輯**、**清單刪除** 事件
```

FinishedTodos.vue

```markdown
新增 FinishedTodos.vue 路由元件
template
顯示已完成的待辦事項列表

script
篩選並顯示 done 為 true 的待辦事項
```

TodoDetail.vue

```markdown
新增 TodoDetail.vue 路由元件
template
顯示單一待辦事項的詳細資訊
包含編輯和刪除功能

script
根據路由參數 id 取得對應的待辦事項資料
提供編輯和刪除功能
```

ToDoForm.vue

```markdown
新增 ToDoForm.vue 
template
需要一個帶有 <label> 的 <form> 、一個 <input> ，以及一個 <button>

script
data 要有輸入資料 ， 輸入資料要跟 input 做雙向綁定， v-model 加上 lazy,trim
當按下新增的時候，會送出事件 **資料新增** ,還有文字格式的輸入資料，接著清空輸入框
有資料輸入才會送出事件
```

ToDoItemEditForm.vue

```markdown
新增一個 ToDoItemEditForm.vue 
建立一個表單，裡面有一個 <input> 欄位，用來編輯待辦事項的名稱。
有一個「儲存」按鈕和一個「取消」按鈕

當點擊「儲存」按鈕時，元件會送出 **清單編輯** 事件，新的代辦事項名稱。
當點擊「取消」按鈕時，元件會送出 **取消編輯** 事件。
```

**TodoItem**.vue

```markdown
新增一個 **TodoItem**.vue
template
有 div 包括 checkbox input 跟 文字 Label， input id 跟 checked 與 Data 做單向綁定
Label for 跟 ID 做單向綁定， label 用於顯示 label 參數

新增「編輯」和「刪除」按鈕
當點擊「編輯」按鈕時，會切換顯示 ToDoItemEditForm 元件。
當點擊「刪除」按鈕時。發出一個 **清單刪除** 事件，以便更新列表。

使用 ToDoItemEditForm  
當在編輯中，不顯示 div ，改成顯示 ToDoItemEditForm

script
會有三個輸入的 props 參數， Label ， Label 必填的， done 是 boolean ，id 文字必填
Data 包括 isDone 跟 props 的 done 一樣

當 checkbox 有改變，會送出 **checkbox變更** 的事件，還有元件的 id 字串

ToDoItemEditForm 元件 會聽事件 **清單編輯** 事件，送出 **清單編輯** 事件，同時傳遞新的代辦事項名稱，不顯示 ToDoItemEditForm ，將 focus 聚焦在 編輯 按鈕
ToDoItemEditForm 元件 會聽事件 **取消編輯** 事件，不顯示 ToDoItemEditForm ，將 focus 聚焦在 編輯 按鈕
```