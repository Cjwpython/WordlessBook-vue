<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" @open="handleOpen" @close="handleClose" class="addNamespacesDialog">
      <el-form :model="addParams" status-icon :rules="rules" ref="addRefs" label-width="100px" class="demo-ruleForm">
        <slot name="top"></slot>
        <el-form-item :label="label.first" prop="name" label-width="110px">
          <el-input type="text" size="small" v-model="addParams.name" autocomplete="off"></el-input>
        </el-form-item>
        <slot name="body"></slot>
        <el-form-item :label="label.second" prop="nick_name" label-width="110px">
          <el-input type="text" size="small" v-model="addParams.nick_name" autocomplete="off"></el-input>
        </el-form-item>
        <slot name="bottom"></slot>
      </el-form>
      <span slot="footer" class="dialog-footer addNamespacesDialogFooter">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'addEnvsDialog.vue',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      default: '添加命名空间'
    },
    label: {
      type: Object,
      default () {
        return {
          first: '命名空间名称',
          second: '昵称'
        }
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
  data () {
    const validatePass = (rule, value, callback) => {
      const mappingError = {
        name: `${this.label.first}不能为空`,
        nick_name: `${this.label.second}不能为空`
      };
      if (value === '') {
        return callback(new Error(mappingError[rule['field']]));
      }
      callback();
    }
    return {
      addParams: {
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
      },
      dialogVisible: false
    }
  },
  methods: {
    handleOpen () {
      this.$refs['addRefs'] && this.$refs['addRefs'].resetFields();
      this.$emit('open')
    },
    handleClose () {
      this.$emit('update:status', false)
      this.$emit('close');
    },
    addHandle () {
      this.$refs['addRefs'].validate(async (valid) => {
        if (valid) {
          this.$emit('success', this.addParams);
          this.handleClose();
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
