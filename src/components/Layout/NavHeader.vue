<template>
  <div class="doshBoard-layout-header">
    <div class="router-name">{{this.$route.meta.title}}</div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-submenu index="2" class="doshBoard-layout-header-userInfo" :disabled="true">
        <template slot="title">占位</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'NavHeader',
  data () {
    return {
      activeIndex: '1'
    }
  }
}
</script>

<style scoped lang="less">
 @import "./style/index.less";
</style>
