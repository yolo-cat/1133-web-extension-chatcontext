import { createRouter, createWebHashHistory } from 'vue-router'
import TodosView from '../views/TodosView.vue'
import FinishedTodosView from '../views/FinishedTodosView.vue'
import TodoDetailView from '../views/TodoDetailView.vue'
import DataManagementView from '../views/DataManagementView.vue'

const routes = [
  {
    path: '/',
    redirect: '/todos'
  },
  {
    path: '/todos',
    name: 'todos',
    component: TodosView
  },
  {
    path: '/todos/finished',
    name: 'finished-todos',
    component: FinishedTodosView
  },
  {
    path: '/todos/:id',
    name: 'todo-detail',
    component: TodoDetailView,
    props: true
  },
  {
    path: '/data-management',
    name: 'data-management',
    component: DataManagementView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
