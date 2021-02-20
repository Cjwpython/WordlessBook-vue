<template>
  <div>
    <v-json-edit class="json-mode" v-model="json" :mode="'code'" edit :modes="['tree', 'code', 'form', 'text', 'view', 'preview']" search @change="jsonEditChangeHandle"></v-json-edit>
    <section class="json-edit-btn-group">
      <el-button type="primary" size="small" @click="addAndChangeApplicationsHandle">变更配置</el-button>
    </section>
  </div>
</template>

<script>
import { isEmpty } from '@/plugins/core/lib'
export default {
  name: 'json',
  props: ['dataList'],
  data () {
    return {
      json: [],
      detailData: []
    }
  },
  created () {
    this.initialData();
  },
  methods: {
    async initialData () {
      const { data: { data } } = await this.$axios.get(`/application/${this.$route.params.id}`);
      this.json = data['configs'];
    },
    jsonEditChangeHandle (val) {
      this.detailData = val;
    },
    async addAndChangeApplicationsHandle () {
      const value = { configs: this.detailData.length > 0 ? this.detailData : this.json }
      if (isEmpty(value.configs)) {
        this.$message.error('参数数据类型必须为数组类型且不能为空');
        return false;
      }
      const { data } = await this.$axios.post(`/application/${this.$route.params.id}`, { ...value });
      if (Object.is(data['status_code'], 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialData();
      }
    }
  }
}
</script>

<style scoped lang="less">
.applications-detail-alert {
  margin: 10px 0;
}
.json-mode {
  & /deep/ .jsonEditor-vue {
    height: 750px !important;
  }
}
.json-edit-btn-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px 0;
}
</style>
