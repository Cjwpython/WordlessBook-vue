<template>
  <div>
    <section class="detail-topBar">
      <div v-if="data.name" class="detail-belongs-envs">
        所属命名空间:
        <el-tag effect="plain" size="small" class="detail-belongs-tags">{{data.name}}</el-tag>
        <div v-if="appLists.length > 1" class="detail-belongs-count">( 共 <span class="detail-belongs-count-length">{{appLists.length}}</span> 个应用 )</div>
      </div>
      <div>
        <el-tooltip class="item namespace-detail-btn" effect="dark" content="添加应用" placement="top">
          <el-button type="primary" circle icon="el-icon-document-add" size="small" @click="addDialogViable = true"></el-button>
        </el-tooltip>
      </div>
    </section>
    <el-table :data="appLists" class="envs-detail-table" style="width: 100%">
      <el-table-column label="应用名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用id">
        <template slot-scope="scope">
          <span>{{scope.row['_id']}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用简介">
        <template slot-scope="scope">
          <span>{{scope.row['nick_name']}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item namespace-detail-btn" effect="dark" content="修改应用简介" placement="top">
            <el-button size="mini" class="user-edit" @click="editChangeHandle(scope.row)" circle icon="el-icon-edit-outline"></el-button>
          </el-tooltip>
          <popconfirm
                  confirm-button-text='确定'
                  cancel-button-text='取消'
                  icon="el-icon-warning"
                  title="删除操作不可逆，确定删除吗？"
                  @onConfirm="applicationDeleteHandle(scope.row)"
          >
            <el-button size="mini" slot="reference" circle icon="el-icon-delete"></el-button>
          </popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <section>
      <add-dialog :status.sync="addDialogViable" title="添加应用" :label="label" @success="addApplicationHandle"></add-dialog>
      <modify-dialog :status.sync="modifyDialogViable" title="修改应用简介" :data="changeData" @success="changeApplicationHandle"></modify-dialog>
    </section>
  </div>
</template>

<script>
import addDialog from './components/addEnvsDialog'
import modifyDialog from './components/modifyEnvsDialog'
export default {
  name: 'detail',
  components: {
    addDialog,
    modifyDialog
  },
  data () {
    return {
      appLists: [],
      data: {},
      addDialogViable: false,
      label: {
        first: '应用名称',
        second: '应用简介'
      },
      modifyDialogViable: false,
      changeData: {}
    }
  },
  created () {
    this.initialData();
  },
  methods: {
    async initialData () {
      const { data: { data } } = await this.$axios.get(`/env/${this.$route.params.id}`);
      this.appLists = data['apps'];
      this.data = data;
    },
    async applicationDeleteHandle (row) {
      const { data } = await this.$axios.delete('/application', { data: { application_id: row['_id'] } })
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialData();
      }
    },
    async addApplicationHandle (val) {
      const value = { env_id: this.$route.params.id, ...val };
      const { data } = await this.$axios.post('/application', value);
      if (Object.is(data.code, 201)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialData();
      }
    },
    editChangeHandle (row) {
      this.changeData = row;
      this.modifyDialogViable = true;
    },
    async changeApplicationHandle (val) {
      const value = { application_id: this.changeData['_id'], ...val };
      const { data } = await this.$axios.put('/application', value);
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialData();
      }
    }
  }
}
</script>

<style scoped lang="less">
.envs-detail-table {
  min-height: 750px;
  &:before {
     height: 0 !important;
   }
}
.namespace-detail-btn {
  margin-right: 10px;
}
.detail-belongs-envs {
  display:flex;
  .detail-belongs-count {
    margin-left: 10px;
  }
}
.detail-topBar {
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
