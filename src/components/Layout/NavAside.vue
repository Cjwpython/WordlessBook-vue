<template>
  <div class="dashBoard-layout-NavLeft">
    <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="doshBoardLeftMenuHandle" :default-active="activeIndex" class="el-menu-demo" mode="vertical">
      <!--logo临时占位-->
      <div style="width: 60%;height:50px;background:#fff;margin:10px auto;border-radius: 5px;"></div>
      <div v-for="(item, index) in menuLists" :key="index">
        <!-- 子集渲染,递归组件,选中值为数据中的路由(url) -->
        <child-menu :menu="item" v-if="item.subs" :key="index"></child-menu>
        <!--非子集渲染-->
        <el-menu-item :index="item.url" style="text-align: center;" :disabled="item.disabled" v-else :class="{'active-menu': activeIndex === item.url}">{{item.label}}</el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
import ChildMenu from './ChildMenu'
export default {
  name: 'NavAside',
  components: { ChildMenu },
  data () {
    return {
      activeIndex: '',
      // 临时模拟数据
      menuLists: [
        { label: '控制台', url: '/overview', disabled: true },
        { label: '环境', url: '/envs' },
        { label: '应用', url: '/applications', disabled: true },
        { label: '命名空间', url: '/namespaces' },
        { label: '权限设置', url: '/auth-settings', disabled: true },
        { label: '系统设置', url: '/system-settings', disabled: true },
        { label: '帮助', url: '/help', disabled: true }
        // {
        //   label: '控制中心1',
        //   url: '/console2',
        //   subs: [
        //     { label: '控制中心子集', url: '/consolesubs' },
        //     { label: '控制中心子集1', url: '/subs1', subs: [{ label: '子集2', url: '/subs2', subs: [{ label: '子集3', url: '/subs3', subs: [{ label: '子集4', url: '/subs4' }] }] }] }
        //   ]
        // }
      ]
    }
  },
  created () {
    this.activeIndex = this.$route.path
  },
  methods: {
    doshBoardLeftMenuHandle (index, indexPath) {
      this.activeIndex = index
      this.$router.push({ path: index })
    }
  }
}
</script>

<style scoped lang="less">
  @import "./style/index";
</style>
