<template>
  <div class="doshBoard-layout-header">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-submenu index="2" class="doshBoard-layout-header-userInfo">
        <template slot="title">我的工作台</template>
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
