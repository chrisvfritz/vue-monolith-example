import Vue from 'vue'
import App from './app'
import VueRouter from 'vue-router'

// Don't warn about using the dev version of Vue in development
Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/home'),
      beforeEnter(routeTo, routeFrom, next) {
        fetch('/api/todos')
          .then(response => response.json())
          .then(todos => {
            routeTo.params.todos = todos
            next()
          })
      },
      props: route => ({ todos: route.params.todos }),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/about'),
    },
  ],
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
