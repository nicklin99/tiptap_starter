import { createRouter, createWebHashHistory } from 'vue-router'

import WebExample from '@/examples/web.vue'
import MarkdownExample from '@/examples/markdown.vue'

const routes = [
  { path: '/', component: WebExample },
  { path: '/about', component: MarkdownExample },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router