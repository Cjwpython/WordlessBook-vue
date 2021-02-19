<template>
  <div>
    <el-dialog title="修改别名" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" @open="handleOpen" @close="handleClose" class="addNamespacesDialog">
      <el-form :model="editParams" status-icon :rules="rules" ref="editRefs" label-width="100px">
        <el-form-item label="环境别名" prop="nick_name" label-width="110px">
          <el-input type="text" size="small" v-model="editParams.nick_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer addNamespacesDialogFooter">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="editHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'modifyEnvsDialog',
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
      editParams: {
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
        console.log(val, 'val');
        this.$set(this.editParams, 'nick_name', val.nick_name);
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
      this.$refs['editRefs'].resetFields();
      this.$emit('update:status', false)
    },
    editHandle () {
      this.$refs['editRefs'].validate(async (valid) => {
        if (valid) {
          this.$emit('success', this.editParams);
          this.handleClose();
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
