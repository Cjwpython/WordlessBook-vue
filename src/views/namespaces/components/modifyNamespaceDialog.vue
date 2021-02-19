<template>
  <div>
    <el-dialog title="修改别名" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" @open="handleOpen" @close="handleClose" class="addNamespacesDialog">
      <el-form :model="editNamespaceParams" status-icon :rules="rules" ref="editNamespace" label-width="100px">
        <el-form-item label="别名" prop="nick_name" label-width="110px">
          <el-input type="text" size="small" v-model="editNamespaceParams.nick_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer addNamespacesDialogFooter">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="editNamespaceHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'modifyNamespaceDialog',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    data: {
      type: Object
    }
  },
  data () {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('别名不能为空'));
      }
      callback();
    }
    return {
      dialogVisible: false,
      editNamespaceParams: {
        nick_name: ''
      },
      rules: {
        nick_name: [
          { validator: validateName, trigger: 'blur', required: true }
        ]
      }
    }
  },
  watch: {
    // vue 双向数据流
    status: {
      handler (val) {
        this.dialogVisible = val;
      },
      deep: true
    },
    data: {
      handler (val) {
        this.$set(this.editNamespaceParams, 'nick_name', val.nick_name);
      },
      deep: true
    }
  },
  methods: {
    handleOpen () {
      // todo open dialog
    },
    handleClose () {
      this.handleOpen();
      this.$refs['editNamespace'].resetFields();
      this.$emit('update:status', false)
    },
    editNamespaceHandle () {
      this.$refs['editNamespace'].validate(async (valid) => {
        if (valid) {
          this.$emit('ok', this.editNamespaceParams);
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
  .addNamespacesDialog {
    & /deep/ .el-dialog__footer {
      margin-top: -20px;
    }
  }
</style>
