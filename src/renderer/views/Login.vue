<template>
  <div class="page-container">
    <el-form class="login-form" :rules="rules" ref="ruleForm" :model="ruleForm" label-position="top"
      label-width="100px">
      <el-form-item label="账号" prop="account">
        <el-input placeholder="请输入豆瓣账号（手机号/邮箱）" icon="my-phone" v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" icon="my-password" v-model="ruleForm.password" type="password"
          @keyup.enter="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-button" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
    <div class="tooltip-container">
      提示：此应用为第三方个人开发，非豆瓣官方应用，请知悉！
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { FETCH_POST_LOGIN } from 'store/mutation-types'
  import { PostLoginParams } from 'api/declarations'
  import { dispatchUserPostLogin } from 'store/index'

  export default Vue.extend({
    data() {
      return {
        ruleForm: {
          account: '',
          password: ''
        },
        rules: {
          account: [{ required: true, message: '请输入豆瓣账号', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
        }
      }
    },
    methods: {
      login() {
        const formRef: any = this.$refs.ruleForm
        formRef.validate((valid: boolean) => {
          if (!valid) {
            return
          }

          const payload: PostLoginParams = {
            account: this.ruleForm.account,
            password: this.ruleForm.password
          }

          this.$store.dispatch(FETCH_POST_LOGIN, payload)

          dispatchUserPostLogin({
            account: this.ruleForm.account,
            password: this.ruleForm.password
          }).then(() => {
            console.log('hehe')
          })
        })
      }
    }
  })
</script>

<style lang="scss">
  .page-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .login-form {
      display: block;
      width: 400px;

      .login-button {
        width: 100%;
      }
    }
  }

  .tooltip-container {
    font-size: 12px;
    margin: 10px 0;
  }
</style>

