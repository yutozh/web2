<template>
  <div class="admin-login-container">
    <div class="admin-login">
      <div class="login-title">
        <h2>后台登录</h2>
      </div>
      <div class="login-body">
        <form class="ui form">
          <div class="field">
            <label>用户名</label>
            <input type="text" placeholder="请输入用户名..."
                   v-model="username"/>
          </div>
          <div class="field">
            <label>密码</label>
            <input type="password" placeholder="请输入密码..."
                   v-model="password"/>
          </div>
        </form>
      </div>
      <div class="login-btn">
        <span>{{ promptMsg }}</span>
        <button class="ui button large basic teal"
                :class="{loading:isLoading, disable:isLoading}"
                v-on:click="btnSubmit">登录
        </button>
      </div>
    </div>
    <div class="admin-login-foot">
      <p>欢迎来访</p>
    </div>
  </div>

</template>

<script>
import bgURL from '../../assets/img/adminBG.jpg'

const $ = window.$
const initGeetest = window.initGeetest

export default {
  data () {
    return {
      username: '',
      password: '',
      promptMsg: '',
      captchaObj: '',
      isLoading: false
    }
  },
  created () {
    this.$http.get(this.$api.adminAPI.getCaptcha).then((res) => {
      const data = res.data
      initGeetest({
        gt: data.gt,
        challenge: data.challenge,
        offline: !data.success,
        new_captcha: data.new_captcha,
        product: 'bind'
      }, (captchaObj) => {
        this.captchaObj = captchaObj
        captchaObj.onSuccess(() => {
          let result = captchaObj.getValidate()
          this.isLoading = true
          this.$http({
            method: 'post',
            url: this.$api.adminAPI.postLogin,
            data: {
              geetest_challenge: result.geetest_challenge,
              geetest_validate: result.geetest_validate,
              geetest_seccode: result.geetest_seccode,
              username: this.username,
              password: this.password
            },
            withCredentials: true
          }).then((res) => {
            const data = res.data
            if (data.status === 0) {
              localStorage.setItem('login', '1')
              this.$root.$router.replace('/')
            } else {
              this.promptMsg = data.msg
            }
            this.isLoading = false
          }).catch((e) => {
            this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
            console.log(e)
          })
        })
      })
    }).catch((e) => {
      this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      console.log(e)
    })
    // $.ajax({
    //   url: this.$api.adminAPI.getCaptcha,
    //   type: 'get',
    //   success: (data) => {
    //     console.log(data)
    //     initGeetest({
    //       gt: data.gt,
    //       challenge: data.challenge,
    //       offline: !data.success,
    //       new_captcha: data.new_captcha,
    //       product: 'bind'
    //     }, (captchaObj) => {
    //       this.captchaObj = captchaObj
    //       captchaObj.onSuccess(() => {
    //         let result = captchaObj.getValidate()
    //         $.ajax({
    //           url: '/adminAPI/postLogin',
    //           type: 'post',
    //           data: {
    //             geetest_challenge: result.geetest_challenge,
    //             geetest_validate: result.geetest_validate,
    //             geetest_seccode: result.geetest_seccode,
    //             username: this.username,
    //             password: this.password
    //           },
    //           beforeSend: () => {
    //             this.isLoading = true
    //           },
    //           success: (data) => {
    //             if (data.status === 0) {
    //               this.$root.$router.replace('/admin')
    //             } else {
    //               this.promptMsg = data.msg
    //             }
    //             this.isLoading = false
    //           }
    //         })
    //       })
    //     })
    //   }
    // })
  },
  mounted () {
    let img1 = new Image()
    img1.src = bgURL
    img1.onload = () => {
      $('.admin-login-container').css('background-image', `url(${img1.src})`)
      this.$emit('bgReady')
    }
  },
  methods: {
    btnSubmit () {
      if (this.username.length === 0) {
        this.promptMsg = '请输入用户名'
        return
      }
      if (this.password.length === 0) {
        this.promptMsg = '请输入密码'
        return
      }
      this.promptMsg = ''
      this.captchaObj.verify()
    }
  }
}
</script>

<style>
  .admin-login-container {
    position: fixed;
    background: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
  }

  .admin-login {
    position: absolute;
    width: 30em;
    margin: auto;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 25em;
  }

  .login-title {
    color: #c200ff;
    text-align: center;
  }

  .login-btn {
    margin-top: 5em;
    text-align: right;
  }

  .login-btn span {
    margin-right: 2em;
    font-weight: bold;
    color: red;
  }

  .admin-login-foot {
    position: fixed;
    bottom: 4em;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .admin-login-foot p {
    font-weight: bold;
    font-size: large;
    color: #a66251;
  }
</style>
