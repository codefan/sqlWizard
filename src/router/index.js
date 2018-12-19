import Vue from 'vue'
import Router from 'vue-router'
import SqlWizard from '@/components/SqlWizard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SqlWizard',
      component: SqlWizard
    }
  ]
})
