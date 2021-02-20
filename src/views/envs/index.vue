<template>
  <div>
    <!--top bar-->
    <section class="envs-topBar">
      <div>
        <span class="envs-topBar-filter">筛选:</span>
        <el-select v-model="namespaceFilterValue" clearable size="small" style="width: 300px;" @change="initialData" placeholder="请选择命名空间">
          <el-option
                  v-for="(items, index) in namespaceLists"
                  :key="index"
                  :label="`${items['name']} (${items['nick_name']})`"
                  :value="items['_id']">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-tooltip class="item namespace-detail-btn" effect="dark" content="添加环境" placement="top">
          <el-button type="primary" circle icon="el-icon-document-add" size="small" @click="addEnvsDialogViable = true"></el-button>
        </el-tooltip>
      </div>
    </section>
    <!--env lists-->
    <el-table :data="envsLists" class="envs-table" style="width: 100%">
      <el-table-column label="环境名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境ID">
        <template slot-scope="scope">
          <span>{{scope.row['_id']}}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境别名">
        <template slot-scope="scope">
          <span>{{scope.row['nick_name']}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属命名空间">
        <template slot-scope="scope">
          <el-tag size="small">{{scope.row['namespace_name']}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="命名空间ID">
        <template slot-scope="scope">
          <span>{{scope.row['namespace_id']}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="详情" placement="top">
            <el-button size="mini" class="user-edit" @click="handleDetail(scope.row)" circle icon="el-icon-tickets"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="变更命名空间" placement="top">
            <el-button size="mini" class="user-edit" @click="handleChange(scope.row)" circle icon="el-icon-refresh-right"></el-button>
          </el-tooltip>
          <el-tooltip class="item envs-detail-btn" effect="dark" content="修改别名" placement="top">
            <el-button size="mini" class="user-edit" @click="editChangeHandle(scope.row)" circle icon="el-icon-edit-outline"></el-button>
          </el-tooltip>
          <popconfirm
                  confirm-button-text='确定'
                  cancel-button-text='取消'
                  icon="el-icon-warning"
                  title="删除操作不可逆，确定删除吗？"
                  @onConfirm="envsDeleteHandle(scope.row)"
          >
            <el-button size="mini" slot="reference" circle icon="el-icon-delete"></el-button>
          </popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--pagination-->
    <section class="envs-pagination">
      <el-pagination
              background
              :page-sizes="[15, 30, 50, 100]"
              @size-change="envsListsSizeChangeHandle"
              @current-change="envsListsChangeHandle"
              layout="total, sizes, prev, pager, next"
              :total="count">
      </el-pagination>
    </section>
    <!--add envs-->
    <add-envs-dialog title="添加环境" :status.sync="addEnvsDialogViable" :label="labelList" @success="addEnvsHandle">
      <template slot="top">
        <el-form-item label="命名空间" prop="namespace" label-width="110px">
          <el-select v-model="namespaceSelectValue" size="small" style="width: 100%;" placeholder="请选择命名空间">
            <el-option
                    v-for="(items, index) in namespaceLists"
                    :key="index"
                    :label="`${items['name']} (${items['nick_name']})`"
                    :value="items['_id']">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </add-envs-dialog>
    <!--modify envs-->
    <modify-envs-dialog :status.sync="modifyEnvsDialogViable" :data="editData" @success="editEnvsHandle"></modify-envs-dialog>
    <!--change namespaces-->
    <el-dialog title="变更命名空间" :visible.sync="changeEnvsDialogViable" width="20%" :close-on-click-modal="false" @close="changeDialogOpen" class="addNamespacesDialog">
      <div v-if="filterDataLists.length > 0">
        <span style="margin-bottom: 10px;display:block;">命名空间：</span>
        <el-select v-model="changeNamespaceValue" clearable size="small" style="width: 98%;" placeholder="请选择命名空间">
          <el-option
                  v-for="(items, index) in filterDataLists"
                  :key="index"
                  :label="items['name']"
                  :value="items['_id']">
          </el-option>
        </el-select>
      </div>
      <empty-data width="120" v-else>
        <div>无法添加重复的命名空间</div>
        <div>没有可变更命名空间，请前往添加</div>
      </empty-data>
      <span slot="footer" class="dialog-footer addNamespacesDialogFooter">
      <el-button @click="changeEnvsDialogViable = false" size="small">取 消</el-button>
      <el-button type="primary" @click="changeNamespaceHandle" size="small">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import addEnvsDialog from './components/addEnvsDialog'
import modifyEnvsDialog from './components/modifyEnvsDialog'
export default {
  name: 'index',
  components: {
    addEnvsDialog,
    modifyEnvsDialog
  },
  data () {
    return {
      envsLists: [],
      params: {
        current_page: 1,
        current_max_row: 15
      },
      addEnvsDialogViable: false,
      modifyEnvsDialogViable: false,
      changeEnvsDialogViable: false,
      labelList: {
        first: '环境名称',
        second: '环境别名'
      },
      count: 0,
      namespaceSelectValue: '',
      namespaceFilterValue: '',
      changeNamespaceValue: '',
      editData: null,
      namespaceLists: [],
      changeData: null,
      filterDataLists: []
    }
  },
  created () {
    this.initialData();
    this.getAllNamespace();
  },
  methods: {
    // 初始化获取数据
    async initialData () {
      const { data: { data } } = await this.$axios.get('/envs', { params: { ...this.params, namespace_id: this.namespaceFilterValue } });
      this.count = data['max_count'];
      this.envsLists = data.envs;
    },
    // 获取全部命名空间
    async getAllNamespace () {
      const { data: { data } } = await this.$axios.get('/namespaces', { params: { pagiation: 0 } });
      this.namespaceLists = data.namespaces;
    },
    // 详情
    async handleDetail (row) {
      const { data: { data } } = await this.$axios.get(`/env/${row['_id']}`);
      console.log(data, 'data');
    },
    // 变更命名空间
    handleChange (row) {
      // namespaceLists
      this.filterDataLists = this.namespaceLists.filter(v => v['_id'] !== row.namespace_id);
      this.changeEnvsDialogViable = true;
      this.changeData = row;
    },
    // 修改别名
    editChangeHandle (row) {
      this.modifyEnvsDialogViable = true;
      this.editData = row;
    },
    // 删除
    async envsDeleteHandle (row) {
      const { data } = await this.$axios.delete('/env', { data: { env_id: row['_id'] } });
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialData();
      }
    },
    // 改变条数时触发
    envsListsSizeChangeHandle (val) {
      this.params.current_max_row = val;
      this.initialData();
    },
    // 当分页时触发
    envsListsChangeHandle (val) {
      this.params.current_page = val;
      this.initialData();
    },
    // dialog 添加环境
    async addEnvsHandle (val) {
      const { data } = await this.$axios.post('/env', { namespace_id: this.namespaceSelectValue, ...val });
      if (Object.is(data.code, 201)) {
        this.$notify({ title: '成功', message: '创建环境成功', type: 'success' });
        this.initialData();
      }
    },
    // dialog 修改别名
    async editEnvsHandle (val) {
      const { data } = await this.$axios.put('/env', { env_id: this.editData['_id'], nick_name: val.nick_name });
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialData();
      }
    },
    // 更换应用dialog open 触发
    changeDialogOpen () {
      this.changeNamespaceValue = '';
    },
    // 变更命名空间确定
    async changeNamespaceHandle () {
      const { namespace_id, _id } = this.changeData;
      const { data } = await this.$axios.post('/env/change', { namespace_id: this.changeNamespaceValue, env_id: _id, current_namespace_id: namespace_id });
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.changeEnvsDialogViable = false;
        this.initialData();
      }
    }
  }
}
</script>

<style scoped lang="less">
.envs-topBar {
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .envs-topBar-filter {
    margin-right: 10px;
    font-size: 14px;
  }
}
.envs-detail-btn {
  margin-right: 10px;
}
.envs-table {
  min-height: 750px;
  &:before {
    height: 0 !important;
  }
}
.envs-pagination {
  display:flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px 0;
}
.detail-empty-link {
  display:flex;
  & .detail-empty-link-text {
    font-size: 16px;
    margin:0 2px;
  }
}
</style>
