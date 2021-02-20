<template>
  <div>
    <el-dialog title="添加命名空间" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" @open="handleOpen" @close="handleClose" class="addNamespacesDialog">
      <el-form :model="addNamespaceParams" status-icon :rules="rules" ref="addNamespace" label-width="100px" class="demo-ruleForm">
        <el-form-item label="命名空间名称" prop="name" label-width="110px">
          <el-input type="text" size="small" v-model="addNamespaceParams.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name" label-width="110px">
          <el-input type="text" size="small" v-model="addNamespaceParams.nick_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer addNamespacesDialogFooter">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addNamespaceHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'addNamespacesDialog',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      const mapping = {
        name: '名称不能为空',
        nick_name: '昵称不能为空'
      };
      if (value === '') {
        return callback(new Error(mapping[rule['field']]));
      }
      callback();
    }
    return {
      dialogVisible: false,
      addNamespaceParams: {
        name: '',
        nick_name: ''
      },
      rules: {
        name: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        nick_name: [
          { validator: validatePass, trigger: 'blur', required: true }
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
    }
  },
  methods: {
    handleOpen () {
      this.$refs['addNamespace'] && this.$refs['addNamespace'].resetFields();
    },
    handleClose () {
      this.handleOpen();
      this.$emit('update:status', false)
    },
    // 添加命名空间
    addNamespaceHandle () {
      this.$refs['addNamespace'].validate(async (valid) => {
        if (valid) {
          // 校验通过
          const { data: { status_code } } = await this.$axios.post('/namespace', this.addNamespaceParams);
          if (Object.is(status_code, 201)) {
            this.$notify({ title: '成功', message: '创建命名空间成功', type: 'success' });
            this.handleClose();
            this.$emit('success');
          }
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
