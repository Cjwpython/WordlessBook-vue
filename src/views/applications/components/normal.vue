<template>
  <div>
    <el-alert v-if="errorIndex.length === 0 && successAlert" class="applications-detail-alert" title="校验通过" type="success" close-text="知道了" @close="successAlert = false"></el-alert>
    <el-alert class="applications-detail-alert" v-for="(item) in errorIndex" :key="item.index" :title="`第${item.index + 1}行输出格式错误: ${item.value}`" type="error" close-text="知道了" @close="closeAlertHandle(item.index)"></el-alert>
    <div style="display:flex;">
      <section>
        <el-form label-width="120px" :model="applicationConfigLists">
          <el-form-item label="应用信息配置">
            <div class="item">
              <el-form :model="applicationConfigLists" ref="form" :inline="true" label-width="35px" size="small">
                <div class="config-item request" v-for="(item ,index) in applicationConfigLists.list" :key="index">
                  <el-form-item label="key" class="applications-config-formItem">
                    <el-input v-model="item.key"></el-input>
                  </el-form-item>
                  <el-form-item label="value" class="applications-config-formItem">
                    <el-input v-model="item.value"></el-input>
                  </el-form-item>
                  <el-form-item label="type" class="applications-config-formItem">
                    <el-select v-model="item.type" size="small" class="applications-select-type" style="width: 100px;" placeholder="类型">
                      <el-option
                              v-for="item in typeList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div class="tool-bar">
                    <el-button size="mini" icon="el-icon-close" circle v-show="applicationConfigLists.list.length > 1" @click="delConfigsItem(index)"></el-button>
                    <el-button size="mini" type="primary" circle icon="el-icon-plus" v-show="index===applicationConfigLists.list.length-1" @click="addConfigsItem"></el-button>
                  </div>
                </div>
              </el-form>
            </div>
          </el-form-item>
        </el-form>
        <section class="applications-btn-group">
          <el-button type="default" size="small" @click="validate(true)">校验参数</el-button>
          <el-button type="primary" size="small" @click="addAndChangeApplicationsHandle">变更配置</el-button>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {
      applicationConfigLists: {
        list: []
      },
      errorIndex: [],
      shareData: [],
      successAlert: false,
      typeSelectValue: '',
      typeList: [
        {
          label: 'str',
          value: 'str'
        },
        {
          label: 'int',
          value: 'int'
        },
        {
          label: 'float',
          value: 'float'
        },
        {
          label: 'list',
          value: 'list'
        },
        {
          label: 'dict',
          value: 'dict'
        }
      ]
    }
  },
  created () {
    this.initialDetailData();
  },
  methods: {
    async initialDetailData () {
      const { data: { data } } = await this.$axios.get(`/application/${this.$route.params.id}`);
      this.applicationConfigLists.list = data['configs'].reduce((acc, val) => {
        acc.push({ ...val, value: JSON.stringify(val.value) })
        return acc;
      }, []);
      this.shareData = data['configs'];
      if (data['configs'].length === 0) {
        this.applicationConfigLists.list.push({ key: '', value: '' });
        this.shareData.push({ key: '', value: '' });
      }
    },
    validate (valid = false) {
      this.errorIndex = [];
      return this.applicationConfigLists.list.reduce((acc, val, index) => {
        try {
          acc.push({ ...val, value: JSON.parse(val.value) })
          valid && (this.successAlert = true);
        } catch (e) {
          const idx = this.errorIndex.findIndex(v => v.index === index);
          !~idx && this.errorIndex.push({ index, value: val.value });
          valid && (this.successAlert = false);
        }
        return acc;
      }, []);
    },
    async addAndChangeApplicationsHandle () {
      const coverData = this.validate();
      if (this.errorIndex.length > 0) {
        return false;
      }
      const { data } = await this.$axios.post(`/application/${this.$route.params.id}`, { configs: coverData })
      if (Object.is(data['status_code'], 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialDetailData();
        this.successAlert = false;
      }
    },
    closeAlertHandle (index) {
      // 关闭alert删除对应错误信息
      const idx = this.errorIndex.findIndex(v => v.index === index);
      this.errorIndex.splice(idx, 1);
    },
    delConfigsItem (index) {
      if (this.applicationConfigLists.list.length > 1) {
        if (index >= 0) {
          this.applicationConfigLists.list.splice(index, 1);
        }
      }
    },
    addConfigsItem () {
      this.applicationConfigLists.list.push({ key: '', value: '' });
    },
  }
}
</script>

<style scoped lang="less">
  .applications-detail-alert {
    margin: 10px 0;
    width: 750px;
  }
  // 面板全局公共样式
  .panel {
    width: 100%;
    min-height: 750px;
    border:1px solid #cedbe9;
    background:#fff;
    padding: 20px;
    box-sizing: border-box;
    //box-shadow: -1px 4px 12px 0 rgb(0 0 0 10%);
    box-shadow: -1px 4px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
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
  .config-item {
    width: 700px;
    display:flex;
    align-items: center;
  }
  .applications-config-formItem {
    & /deep/ input {
      margin-top: 6px;
    }
    & /deep/ .el-form-item__label {
      display:inline;
    }
  }
  .tool-bar {
    margin-top: -16px;
  }
  .applications-btn-group {
    display:flex;
    align-items: center;
    justify-content: flex-end;
    margin: 80px 0 40px 0;
    width: 715px;
  }
  .applications-select-type {
    & /deep/ .el-select__caret.el-input__icon.el-icon-arrow-up {
      height: 42px;
    }
  }
</style>
