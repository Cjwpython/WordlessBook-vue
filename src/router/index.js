import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Layout/Index'

Vue.use(VueRouter)
// 解决路由跳转相同的地址报错( 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题 )
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
  try {
    return originalPush.call(this, location).catch(err => err);
  } catch (error) {
    console.error(error);
  }
};
const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    redirect: '/namespaces',
    children: [
      {
        path: '/namespaces',
        name: 'namespaces',
        component: () => import('../views/namespaces'),
        meta: {
          title: '命名空间'
        }
      },
      {
        path: '/namespaces/:id',
        name: 'namespacesDetail',
        component: () => import('../views/namespaces/detail'),
        meta: {
          title: '命名空间详情'
        }
      },
      {
        path: '/envs',
        name: 'envs',
        component: () => import('../views/envs'),
        meta: {
          title: '环境列表'
        }
      },
      {
        path: '/applications',
        name: 'applications',
        component: () => import('../views/applications'),
        meta: {
          title: '应用列表'
        }
      },
      {
        path: '/applications/:id',
        name: 'applicationsDetail',
        component: () => import('../views/applications/detail'),
        meta: {
          title: '应用详情'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
