<template>
  <div>
    <empty v-if="namespaceLists.length === 0">
      <div class="detail-empty-link">
        {{addNamespaceDialogViable}}
        暂无环境配置信息，点击<el-link type="primary" class="detail-empty-link-text" @click.native="addNamespaceDialogViable = true">新建</el-link>环境
      </div>
    </empty>
    <div v-if="namespaceLists.length > 0">
      <section class="namespace-topBar">
        <div>
          <el-tooltip class="item namespace-detail-btn" effect="dark" content="添加空间" placement="top">
            <el-button type="primary" circle icon="el-icon-document-add" size="small" @click="addNamespaceDialogViable = true"></el-button>
          </el-tooltip>
        </div>
      </section>
      <el-table :data="namespaceLists" class="namespace-table" style="width: 100%">
        <el-table-column label="空间名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="空间ID">
          <template slot-scope="scope">
            <span>{{scope.row['_id']}}</span>
          </template>
        </el-table-column>
        <el-table-column label="别名">
          <template slot-scope="scope">
            <span>{{scope.row['nick_name']}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="详情" placement="top">
              <el-button size="mini" class="user-edit" @click="handleDetail(scope.$index, scope.row)" circle icon="el-icon-tickets"></el-button>
            </el-tooltip>
            <el-tooltip class="item namespace-detail-btn" effect="dark" content="编辑" placement="top">
              <el-button size="mini" class="user-edit" @click="editChangeHandle(scope.row)" circle icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-popconfirm
                    confirm-button-text='确定'
                    cancel-button-text='取消'
                    icon="el-icon-warning"
                    title="删除操作不可逆，确定删除吗？"
                    @onConfirm="namespaceDeleteHandle(scope.$index, scope.row)"
            >
              <el-button size="mini" slot="reference" circle icon="el-icon-delete"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <section class="namespace-pagination">
        <el-pagination
                background
                :page-sizes="[15, 30, 50, 100]"
                @size-change="namespaceListsSizeChangeHandle"
                @current-change="namespaceListsChangeHandle"
                layout="total, sizes, prev, pager, next"
                :total="count">
        </el-pagination>
      </section>
    </div>
    <!--添加空间-->
    <add-namespaces-dialog :status.sync="addNamespaceDialogViable" @success="addNamespaceDialogSuccess"></add-namespaces-dialog>
    <!--编辑命名空间-->
    <modify-namespace-dialog :status.sync="editNamespaceDialogViable" :data="editData" @ok="editNamespaceHandle"></modify-namespace-dialog>
  </div>
</template>

<script>
import addNamespacesDialog from './components/addNamespacesDialog'
import modifyNamespaceDialog from './components/modifyNamespaceDialog'
export default {
  name: 'index',
  components: {
    addNamespacesDialog,
    modifyNamespaceDialog
  },
  data () {
    return {
      namespaceLists: [],
      tableParams: {
        current_page: 1,
        current_max_row: 15
      },
      count: 0,
      addNamespaceDialogViable: false,
      editNamespaceDialogViable: false,
      editData: null
    }
  },
  created () {
    this.initialData();
  },
  methods: {
    async initialData () {
      const { data: { data } } = await this.$axios.get('/namespaces', { params: this.tableParams });
      this.count = data['max_count'];
      this.namespaceLists = data.namespaces;
    },
    // 点击详情跳转
    handleDetail (index, row) {
      const routeData = this.$router.resolve({ name: 'namespacesDetail', params: { id: row['_id'] } });
      window.open(routeData.href, '_blank');
    },
    // 条数发生改变时触发
    namespaceListsSizeChangeHandle (val) {
      this.tableParams.current_max_row = val;
      this.initialData();
    },
    // 页数发生改变时触发
    namespaceListsChangeHandle (val) {
      this.tableParams.current_page = val;
      this.initialData();
    },
    // 删除
    async namespaceDeleteHandle (index, row) {
      console.log('点击删除触发');
      const { data: { message, status_code } } = await this.$axios.delete('/namespace', { data: { namespace_id: row['_id'] } })
      if (Object.is(status_code, 200)) {
        this.$notify({ title: '成功', message, type: 'success' });
        this.initialData();
      }
    },
    // 添加
    addNamespaceDialogSuccess () {
      this.initialData();
    },
    // 编辑
    editChangeHandle (row) {
      this.editNamespaceDialogViable = true;
      this.editData = row;
    },
    // 编辑调用api
    async editNamespaceHandle (val) {
      const { data: { status_code, message } } = await this.$axios.put('/namespace', { namespace_id: this.editData['_id'], ...val })
      if (Object.is(status_code, 200)) {
        this.$notify({ title: '成功', message, type: 'success' });
        this.editNamespaceDialogViable = false;
        this.initialData();
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "./style/namespaces";
</style>
