<template>
  <div>
    <!--top bar-->
    <section class="applications-topBar">
<!--      <div>-->
<!--        <span class="envs-topBar-filter">筛选:</span>-->
<!--        <el-select v-model="namespaceFilterValue" clearable size="small" style="width: 300px;" @change="initialData" placeholder="请选择命名空间">-->
<!--          <el-option-->
<!--                  v-for="(items, index) in namespaceLists"-->
<!--                  :key="index"-->
<!--                  :label="`${items['name']} (${items['nick_name']})`"-->
<!--                  :value="items['_id']">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </div>-->
      <div>
        <el-tooltip class="item namespace-detail-btn" effect="dark" content="添加应用" placement="top">
          <el-button type="primary" circle icon="el-icon-document-add" size="small" @click="addApplicationDialogViable = true"></el-button>
        </el-tooltip>
      </div>
    </section>
    <!--applications lists-->
    <section>
      <el-table :data="applicationLists" class="application-table" style="width: 100%">
        <el-table-column label="应用名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="应用ID">
          <template slot-scope="scope">
            <span>{{scope.row['_id']}}</span>
          </template>
        </el-table-column>
        <el-table-column label="应用简介">
          <template slot-scope="scope">
            <span>{{scope.row['nick_name']}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属环境">
          <template slot-scope="scope">
            <el-tag size="small">{{scope.row['env_name']}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="环境ID">
          <template slot-scope="scope">
            <span>{{scope.row['env_id']}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看应用详情" placement="top">
              <el-button size="mini" class="user-edit" @click="handleDetail(scope.row)" circle icon="el-icon-tickets"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="变更应用环境" placement="top">
              <el-button size="mini" class="user-edit" @click="handleChange(scope.row)" circle icon="el-icon-refresh-right"></el-button>
            </el-tooltip>
            <el-tooltip class="item application-detail-btn" effect="dark" content="修改简介" placement="top">
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
      <!--pagination-->
      <section class="application-pagination">
        <el-pagination
                background
                :page-sizes="[15, 30, 50, 100]"
                @size-change="applicationListsSizeChangeHandle"
                @current-change="applicationListsChangeHandle"
                layout="total, sizes, prev, pager, next"
                :total="count">
        </el-pagination>
      </section>
    </section>
    <!--add applications dialog-->
    <add-dialog :status.sync="addApplicationDialogViable" title="添加应用" :label="label" @success="addApplicationHandle" @open="getEnvsLists(true)">
      <template slot="top">
        <el-form-item label="配置环境" prop="namespace" label-width="110px">
          <el-select v-model="envSelectValue" size="small" class="application-select-envs" style="width: 100%;" :popper-append-to-body="false" placeholder="请选择环境">
            <el-option
                    v-for="(items, index) in envLists"
                    :key="index"
                    :label="items['name']"
                    :value="items['_id']">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </add-dialog>
    <modify-dialog :status.sync="modifyApplicationDialogViable" title="修改应用简介" :label="modifyAppsLabel" :data="editRowData" @success="editApplicationHandle"></modify-dialog>
    <!--change namespaces-->
    <el-dialog title="变更环境" :visible.sync="changeApplicationDialogViable" width="20%" :close-on-click-modal="false" @open="changeDialogOpen" class="addNamespacesDialog">
      <div v-if="filterDataLists.length > 0">
        <span style="margin-bottom: 10px;display:block;">选择环境：</span>
        <el-select v-model="changeEnvsValue" class="change-application-select-envs" :popper-append-to-body="false" clearable size="small" style="width: 98%;" placeholder="请选择命名空间">
          <el-option
                  v-for="(items, index) in filterDataLists"
                  :key="index"
                  :label="items['name']"
                  :value="items['_id']">
          </el-option>
        </el-select>
      </div>
      <empty-data width="120" v-else>
        <div>无法添加重复的环境</div>
        <div>没有可变更环境，请前往添加</div>
      </empty-data>
      <span slot="footer" class="dialog-footer addNamespacesDialogFooter">
      <el-button @click="changeApplicationDialogViable = false" size="small">取 消</el-button>
      <el-button type="primary" @click="changeApplicationHandle" size="small">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import addDialog from '../envs/components/addEnvsDialog'
import modifyDialog from '../envs/components/modifyEnvsDialog'
export default {
  name: 'application-index',
  components: {
    addDialog,
    modifyDialog
  },
  data () {
    return {
      params: {
        current_page: 1,
        current_max_row: 15
      },
      count: 0,
      applicationLists: [],
      addApplicationDialogViable: false,
      label: {
        first: '应用名称',
        second: '应用简介'
      },
      // envs
      envSelectValue: '',
      envLists: [],
      // modify
      modifyApplicationDialogViable: false,
      modifyAppsLabel: {
        first: '应用简介'
      },
      editRowData: null,
      // change
      changeApplicationDialogViable: false,
      filterDataLists: [],
      changeEnvsValue: '',
      changeData: {}
    }
  },
  created () {
    this.initialApplicationData();
  },
  methods: {
    // 获取应用列表
    async initialApplicationData () {
      const { data: { data } } = await this.$axios.get('/applications', { params: { ...this.params } });
      this.count = data['max_count'];
      this.applicationLists = data['apps'];
    },
    // 获取所有环境列表
    async getEnvsLists (reset = false) {
      // reset value
      reset && (this.envSelectValue = '');
      const { data: { data } } = await this.$axios.get('envs', { params: { pagiation: 0 } });
      this.envLists = data.envs;
    },
    // 获取应用详情
    async handleDetail (val) {
      const routeData = this.$router.resolve({ name: 'applicationsDetail', params: { id: val['_id'] } });
      window.open(routeData.href, '_blank');
    },
    async handleChange (row) {
      await this.getEnvsLists();
      this.filterDataLists = this.envLists.filter(v => v['_id'] !== row.env_id);
      this.changeData = row;
      this.changeApplicationDialogViable = true;
    },
    // 修改应用简介
    editChangeHandle (data) {
      this.editRowData = data;
      this.modifyApplicationDialogViable = true;
    },
    async editApplicationHandle (val) {
      const value = { application_id: this.editRowData['_id'], ...val };
      const { data } = await this.$axios.put('/application', value);
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialApplicationData();
      }
    },
    // 删除应用
    async applicationDeleteHandle (row) {
      const { data } = await this.$axios.delete('/application', { data: { application_id: row['_id'] } });
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialApplicationData();
      }
    },
    // 添加应用dialog 触发
    async addApplicationHandle (val) {
      const value = { env_id: this.envSelectValue, ...val };
      const { data } = await this.$axios.post('/application', value);
      if (Object.is(data.code, 201)) {
        this.$notify({ title: '成功', message: '创建应用成功', type: 'success' });
        this.initialApplicationData();
      }
    },
    // 改变条数触发
    applicationListsSizeChangeHandle (val) {
      this.params.current_max_row = val;
      this.initialApplicationData();
    },
    // 改变分页触发
    applicationListsChangeHandle (val) {
      this.params.current_page = val;
      this.initialApplicationData();
    },
    // 更换应用dialog open 触发
    changeDialogOpen () {
      this.changeEnvsValue = '';
    },
    // 点击确定变更环境触发
    async changeApplicationHandle () {
      if (!this.changeEnvsValue) {
        this.$message.error('必须选择一个变更环境');
        return false;
      }
      const { env_id, _id } = this.changeData;
      const value = { current_env_id: env_id, application_id: _id, env_id: this.changeEnvsValue };
      const { data } = await this.$axios.post('/application/change', value);
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.changeApplicationDialogViable = false;
        this.initialApplicationData();
      }
    }
  }
}
</script>

<style scoped lang="less">
.applications-topBar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}
.application-detail-btn {
  margin-right: 10px;
}
.application-select-envs {
  // 覆盖下拉框过宽问题
  & /deep/ .el-select-dropdown__wrap.el-scrollbar__wrap {
    max-width: 600px;
  }
}
.change-application-select-envs {
  // 覆盖下拉框过宽问题
  & /deep/ .el-select-dropdown__wrap.el-scrollbar__wrap {
    max-width: 400px;
  }
}
.application-pagination {
  display:flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px 0;
}
.application-table {
  min-height: 750px;
  &:before {
    height: 0 !important;
  }
}
</style>
