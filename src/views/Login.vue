<template>
  <div class="app-container login-page">
    <div class="bg"></div>
    <div class="login-container">
      <div class="qrcode-wrapper">
        <div class="qrcode">
          <img src="/img/qrcode3.png" draggable="false">
          <p>— 系统建议入口 —</p>
        </div>
      </div>
      <div class="login-form__wrapper">
        <div class="login-form">
          <h2>用户登录</h2>
          <mu-form ref="form" :model="validateForm" label-position="right" label-width="60">
            <mu-form-item label="用户名" prop="username" :rules="usernameRules">
              <mu-text-field
                v-model="validateForm.username"
                prop="username"
                placeholder="请输入用户名"
              />
            </mu-form-item>
            <mu-form-item label="密 码" prop="password" :rules="passwordRules">
              <mu-text-field
                v-model="validateForm.password"
                prop="password"
                placeholder="请输入密码"
                :action-icon="visibility ? 'visibility_off' : 'visibility'"
                :action-click="() => (visibility = !visibility)"
                :type="visibility ? 'text' : 'password'"
              />
            </mu-form-item>
<!--            <mu-form-item label="验证码">-->
<!--              <mu-text-field type="text" prop="password" placeholder="请输入验证码">-->
<!--                <template #append>-->
<!--                  <span style="font-style: italic;">4025</span>-->
<!--                </template>-->
<!--              </mu-text-field>-->
<!--            </mu-form-item>-->
            <mu-form-item>
              <mu-checkbox label="记住密码" v-model="validateForm.rememberMe"></mu-checkbox>
              <a href="javascript:;" class="forget-pass" @click="showDialog">忘记密码?</a>
            </mu-form-item>
            <mu-form-item>
              <mu-button
                color="primary"
                @click="submit"
                v-loading="loading"
                data-mu-loading-size="24"
              >
                提交
              </mu-button>
              <mu-button @click="clear">重置</mu-button>
            </mu-form-item>
          </mu-form>
        </div>
      </div>
    </div>

    <div class="footer">
      <p style="text-align: center">Copyright ©2017 郑州新通路商贸有限公司.All rights reserved.</p>
      <p style="text-align: center">豫ICP备17015335号 <a href="http://www.beian.miit.gov.cn">工业和信息化部</a></p>
    </div>

    <mu-snackbar position="top" :open.sync="snackbar.open">
      请联系系统管理员，联系方式：13346951390
      <mu-button flat slot="action" color="info" @click="snackbar.open = false">关闭</mu-button>
    </mu-snackbar>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'LoginPage',
  data () {
    return {
      usernameRules: [
        { validate: (val) => !!val, message: '必须填写用户名' },
        { validate: (val) => val.length >= 3, message: '用户名长度大于3' }
      ],
      passwordRules: [
        { validate: (val) => !!val, message: '必须填写密码' },
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10' }
      ],
      validateForm: {
        username: '',
        password: '',
        rememberMe: true
      },
      snackbar: {
        open: false
      },
      loading: false,
      visibility: false
    }
  },
  methods: {
    ...mapActions([
      'signIn'
    ]),
    submit () {
      this.$refs.form.validate().then((valid) => {
        if (valid) {
          this.$progress.start()
          this.loading = true
          this.signIn(this.validateForm).then(response => {
            this.$router.push({ name: 'home' })
            this.loading = false
            this.$progress.done()
          }).catch(err => {
            this.$toast.error({
              message: err.response?.data?.detail,
              position: 'top'
            })
            this.loading = false
            this.$progress.done()
          })
        }
      })
    },
    clear () {
      this.$refs.form.clear()
      this.validateForm = {
        username: '',
        password: '',
        isAgree: false
      }
    },
    showDialog () {
      this.snackbar.open = true
    }
  }
}
</script>

<style lang="scss" scoped>
$radius: 10px;
$color: #2f4071;

.login-page {
  overflow: hidden;
  background: #303030 url(/img/login-bg-02.jpg) no-repeat center center;
  background-size: cover;
  transition: all 2s linear;
  transform: translateZ(0);
  overflow: hidden;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,.5);
}
.login-container {
  width: 640px;
  height: 400px;
  background: transparent;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  opacity: .85;
  border-radius: $radius;
  display: flex;
}
.qrcode-wrapper {
  width: 40%;
  height: 100%;
  background-color: rgba(47, 64, 113, .5);
  border-top-left-radius: $radius;
  border-bottom-left-radius: $radius;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  .qrcode {
    width: 50%;
    img {
      max-width: 100%;
    }
  }
}
.login-form__wrapper {
  flex: 1;
  border-top-right-radius: $radius;
  border-bottom-right-radius: $radius;
  background-color: #ffffff;
}

.login-form {
  padding: 20px;
  h2 {
    color: $color;
    font-weight: normal;
    text-align: center;
    margin-bottom: 55px;
    user-select: none;
  }
  .forget-pass {
    font-size: 12px;
    color: $color;
    line-height: 2;
  }
}

.footer {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(221, 220, 220, 0.5);
  user-select: none;
}
</style>
