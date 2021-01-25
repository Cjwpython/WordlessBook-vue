<template>
  <div class="dashBoard-login-content">
    <div class="dashBoard-login-container">
      <div class="dashBoard-login-card">
        <!--dashBoard logo-->
        <div class="dashBoard-login-logo"></div>
        <!--dashBoard 登录表单-->
        <div class="dashBoard-login-form">
          <el-form :model="dashBoardLoginConfig" status-icon :rules="logoRules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item prop="user">
              <el-input type="text" v-model="dashBoardLoginConfig.username" autocomplete="off" :placeholder="showPlaceholder('username')"></el-input>
            </el-form-item>
            <el-form-item prop="pass">
              <el-input type="password" v-model="dashBoardLoginConfig.password" autocomplete="off" :placeholder="showPlaceholder('password')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="dashBoard-login-btn" @click="loginHandle('ruleForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    const validatePass = () => {}
    return {
      dashBoardLoginConfig: {
        username: '',
        password: ''
      },
      logoRules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginHandle () {
      this.$axios.post('/api/user/login', this.dashBoardLoginConfig).then(res => {
        // const { token } = res.data
        // this.localStorage.setItem('access_token', token)
        // this.$router.push({ name: 'index' })
      })
    },
    showPlaceholder (value) {
      const placeHolder = {
        username: '请输入用户名',
        password: '请输入密码'
      }
      return placeHolder[value]
    }
  }
}
</script>

<style scoped lang="less">
@import "./style/index.less";
</style>
