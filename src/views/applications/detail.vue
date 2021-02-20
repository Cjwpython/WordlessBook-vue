<template>
  <div>
    <h3 class="item-title no-select">添加应用配置</h3>
    <section class="apps-detail-changeMode">
      <el-radio v-model="radio" label="normal">默认模式</el-radio>
      <el-radio v-model="radio" label="json">JSON模式</el-radio>
    </section>
    <normal v-if="radio === 'normal'"></normal>
    <json-edit v-if="radio === 'json'"></json-edit>
  </div>
</template>
<script>
import normal from './components/normal'
import jsonEdit from './components/json'
export default {
  components: {
    normal,
    jsonEdit
  },
  data () {
    return {
      radio: 'normal'
    }
  }
}
</script>
<style scoped lang="less">
.apps-detail-changeMode {
  margin-bottom: 20px;
}
// 分组标题
.item-title {
  position: relative;
  padding-left: 10px;
  margin-bottom: 20px;
  &:before {
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    content: "";
    width: 4px;
    height: 80%;
    background-color: #409EFF;
  }
}
</style>
