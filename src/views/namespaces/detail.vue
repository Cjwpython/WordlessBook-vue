<template>
  <div>
    <section v-if="envs && envs.length > 0">
      <section class="detail-topBar">
        <div v-if="data.name" class="detail-belongs-namespaces">
          所属命名空间:
          <el-tag effect="plain" size="small" class="detail-belongs-tags">{{data.name}}</el-tag>
          <div v-if="envs.length > 1" class="detail-belongs-count">( 共 <span class="detail-belongs-count-length">{{envs.length}}</span> 个环境 )</div>
        </div>
        <div>
          <el-tooltip class="item namespace-detail-btn" effect="dark" content="添加环境" placement="top">
            <el-button type="primary" circle icon="el-icon-document-add" size="small" @click="addDialogViable = true"></el-button>
          </el-tooltip>
        </div>
      </section>
      <el-table :data="envs" class="namespace-table" style="width: 100%">
        <el-table-column label="环境名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="环境id">
          <template slot-scope="scope">
            <span>{{scope.row['_id']}}</span>
          </template>
        </el-table-column>
        <el-table-column label="环境别名">
          <template slot-scope="scope">
            <span>{{scope.row['nick_name']}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item namespace-detail-btn" effect="dark" content="修改别名" placement="top">
              <el-button size="mini" class="user-edit" @click="editChangeHandle(scope.row)" circle icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <popconfirm
                    confirm-button-text='确定'
                    cancel-button-text='取消'
                    icon="el-icon-warning"
                    title="删除操作不可逆，确定删除吗？"
                    @onConfirm="envsDeleteHandle(scope.$index, scope.row)"
            >
              <el-button size="mini" slot="reference" circle icon="el-icon-delete"></el-button>
            </popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <empty v-if="envs.length === 0">
      <div class="detail-empty-link">
        暂无环境配置信息，点击<el-link type="primary" class="detail-empty-link-text" @click="addDialogViable = true">新建</el-link>环境
      </div>
    </empty>
    <add-envs-dialog title="添加环境" :status.sync="addDialogViable" :label="label" @success="addEnvsHandle"></add-envs-dialog>
    <modify-envs-dialog :status.sync="editDialogViable" :data="rowData" @success="editEnvsHandle"></modify-envs-dialog>
  </div>
</template>

<script>
import addEnvsDialog from './../envs/components/addEnvsDialog'
import modifyEnvsDialog from './../envs/components/modifyEnvsDialog'
export default {
  name: 'detail',
  components: {
    addEnvsDialog,
    modifyEnvsDialog
  },
  data () {
    return {
      envs: [],
      data: null,
      rowData: null,
      // dialog value
      addDialogViable: false,
      editDialogViable: false,
      label: {
        first: '环境名称',
        second: '环境别名'
      }
    }
  },
  created () {
    this.getNamespaceDetail(this.$route.params.id);
  },
  methods: {
    async getNamespaceDetail (id) {
      const { data: { data } } = await this.$axios.get(`/namespace/${id}`, {});
      this.data = data;
      this.envs = data.envs;
    },
    handleEdit () {},
    // 点击编辑弹窗处理
    editChangeHandle (row) {
      this.rowData = row;
      this.editDialogViable = true;
    },
    // 编辑环境别名
    async editEnvsHandle (val) {
      console.log(val, 'val');
      const { data } = await this.$axios.put('/env', { env_id: this.rowData['_id'], nick_name: val.nick_name });
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.getNamespaceDetail(this.$route.params.id);
      }
    },
    // 删除环境
    async envsDeleteHandle (index, row) {
      const { data } = await this.$axios.delete('/env', { data: { env_id: row['_id'] } });
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.getNamespaceDetail(this.$route.params.id);
      }
    },
    // 添加环境
    async addEnvsHandle (val) {
      const value = Object.assign({}, val, { namespace_id: this.data['_id'] });
      const { data } = await this.$axios.post('/env', value);
      if (data.code === 201) {
        this.$notify({ title: '成功', message: '创建环境成功', type: 'success' });
        this.getNamespaceDetail(this.$route.params.id);
      }
    }
  }
}
</script>

<style scoped lang="less">
.namespace-detail-btn {
  margin-right: 10px;
}
.detail-topBar {
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.detail-belongs-namespaces {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .detail-belongs-tags {
    margin-left: 10px;
  }
  .detail-belongs-count {
    margin-left: 10px;
    .detail-belongs-count-length {
      color:#409EFF;
    }
  }
}
.detail-empty-link {
  display:flex;
  & .detail-empty-link-text {
    font-size: 16px;
    margin:0 2px;
  }
}
</style>
