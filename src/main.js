import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './style/reset.less'
import './style/element-reset.css'
import './assets/icon/iconfont.css'
import empty from './components/common/empty'
import emptyData from './components/common/empty-data'
import popconfirm from './components/common/popconfirm'
import vJsonEdit from 'v-json-edit'
Vue.use(vJsonEdit)
Vue.component('empty', empty);
Vue.component('emptyData', emptyData);
Vue.component('popconfirm', popconfirm);

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  // set title
  to.meta.title && (document.title = to.meta.title);
  next();
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
