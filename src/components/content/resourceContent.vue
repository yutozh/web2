<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <div class="resource-content-container">
        <div class="content-title ui green">
          <i class="icon file outline squared green"></i>{{ resource.name }}
        </div>

        <div class="content-info">
          <a class="ui blue image label">
            <img/>类型
            <div class="detail">{{ resource.type }}</div>
          </a>
          <a class="ui green image label">
            <img/>大小
            <div class="detail">{{ resource.size }}</div>
          </a>
          <a class="ui teal image label">
            <img/>下载次数
            <div class="detail">{{ resource.downloadNum }}</div>
          </a>
          <a class="ui yellow image label">
            <img/>权限
            <div class="detail">{{ resource.auth }}</div>
          </a>
          <a class="ui purple image label">
            <img/>时间
            <div class="detail">{{ resource.date }}</div>
          </a>
        </div>

        <div class="content-download">
          <div class="ui input" :class="{action:resource.auth==='私有'}">
            <input type="text" placeholder="输入下载密钥..."
                   v-if="resource.auth==='私有'" v-model="userPassword">
            <button class="ui button blue inverted"
                    :class="{loading:isLoading,disable:isLoading}"
                    v-on:click="startDownload">
              下载
            </button>
          </div>
        </div>
        <back :backroute="backroute"></back>
        <div class="ui horizontal divider">O_O</div>
        <div class="content-desc">
          <span>描述</span>
          <p>{{ (resource.desc) === '' ? '这个资源暂无描述' : resource.desc}}</p>
        </div>
        <div class="content-detail">
          <span>详细信息</span>
          <p>{{ (resource.detail) === '' ? '这个资源暂无详细信息' : resource.detail}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import back from '../util/back.vue'

const initGeetest = window.initGeetest

export default {
  data () {
    return {
      backroute: '/',
      resource: {},
      resourcePath: this.$route.params.id,
      userPassword: '',
      captchaObj: '',
      isLoading: false
    }
  },
  created () {
    // get file if
    this.$http.get(this.$api.indexAPI.resourceContent, {
      params: {path: this.resourcePath}
    }).then((res) => {
      const data = res.data
      if (data.status === 0) {
        if (data.content === null) {
          this.$root.$router.push({path: '/404'})
          return
        }
        this.resource = data.content
      } else {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        this.$root.$router.replace('/resource')
      }
    }).catch((e) => {
      this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      console.log(e)
    })
    // $.ajax({
    //   url: '/indexAPI/resourceContent',
    //   method: 'get',
    //   data: {path: this.resourcePath},
    //   beforeSend: () => {
    //
    //   },
    //   success: (data) => {
    //     if (data.status === 0) {
    //       if (data.content === null) {
    //         this.$root.$router.push({path: '/404'})
    //         return
    //       }
    //       this.resource = data.content
    //     } else {
    //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
    //       this.$root.$router.replace('/resource')
    //     }
    //   }
    // })
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
          this.$http.get(this.$api.indexAPI.getResourceUrl, {
            params: {
              geetest_challenge: result.geetest_challenge,
              geetest_validate: result.geetest_validate,
              geetest_seccode: result.geetest_seccode,
              url: this.resource.url,
              password: this.userPassword
            }
          }).then((res) => {
            const data = res.data
            if (data.status === 0) {
              window.location.href = data.url
            } else {
              this.$root.eventHub.$emit('showAlert', data.msg)
            }
            this.isLoading = false
          }).catch((e) => {
            this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
            console.log(e)
          })
          // $.ajax({
          //   url: '/indexAPI/getResourceUrl',
          //   type: 'get',
          //   data: {
          //     geetest_challenge: result.geetest_challenge,
          //     geetest_validate: result.geetest_validate,
          //     geetest_seccode: result.geetest_seccode,
          //     url: this.resource.url,
          //     password: this.userPassword
          //   },
          //   beforeSend: () => {
          //     this.isLoading = true
          //   },
          //   success: (data) => {
          //     if (data.status === 0) {
          //       window.location.href = data.url
          //     } else {
          //       this.$root.eventHub.$emit('showAlert', data.msg)
          //     }
          //     this.isLoading = false
          //   }
          // })
        })
      })
    })
    // $.ajax({
    //   url: '/adminAPI/getCaptcha',
    //   type: 'get',
    //   success: (data) => {
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
    //           url: '/indexAPI/getResourceUrl',
    //           type: 'get',
    //           data: {
    //             geetest_challenge: result.geetest_challenge,
    //             geetest_validate: result.geetest_validate,
    //             geetest_seccode: result.geetest_seccode,
    //             url: this.resource.url, password: this.userPassword
    //           },
    //           beforeSend: () => {
    //             this.isLoading = true
    //           },
    //           success: (data) => {
    //             if (data.status === 0) {
    //               window.location.href = data.url
    //             } else {
    //               this.$root.eventHub.$emit('showAlert', data.msg)
    //             }
    //             this.isLoading = false
    //           }
    //         })
    //       })
    //     })
    //   }
    // })
  },
  methods: {
    startDownload () {
      this.captchaObj.verify()
    }
  },
  components: {
    back: back
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.backroute = from.path
    })
  }
}
</script>

<style src="../../assets/css/body-wrapper.css"></style>

<style scoped>
  .resource-content-container {
    width: 40%;
    margin: 0 auto;
  }

  .content-title {
    font-size: x-large;
    text-align: left;
  }

  .content-info {
    text-align: center;
    margin: 30px auto;
    /*两端对齐*/
    display: flex;
    justify-content: space-between;
  }

  .content-info span {
    display: inline-block;
    width: 20%;
    font-size: medium;
  }

  .content-download {
    text-align: right;
    transform: translateY(24px);
    padding: 2px;
    /*使左边的返回按钮可以点击*/
    pointer-events: none;
  }

  .content-download .ui.input {
    /*将非空元素的pointer-events设为auto，使之可点击;*/
    pointer-events: auto;
  }

  .content-download input {
    border-color: #54c8ff !important;
    border-width: 2px !important;
    margin-right: -2px !important;
  }

  .ui.horizontal.divider {
    margin-top: 30px;
  }

  .content-desc, .content-detail {
    margin-top: 50px;
    text-align: left;
  }

  .content-desc span, .content-detail span {
    font-size: large;
  }

  .content-desc p, .content-detail p {
    color: #767278;
    text-indent: 2em;
    word-break: break-all;
  }
</style>
