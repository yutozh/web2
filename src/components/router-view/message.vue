<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <div class="message-form ui form">
        <div class="field">
                    <textarea rows="3" placeholder="留个言吧："
                              maxlength="140" v-model="message"></textarea>
        </div>
        <button class="message-submit" v-on:click="submit">提交</button>
        <span>{{ prompt }}</span>
      </div>
      <div class="message-container">
        <div class="message-body">
          <div class="message-change-btn" v-on:click="fetchData">
            <i class="repeat icon" v-bind:class="{loading:isCircleLoading}"></i>
            <span>换一换</span>
          </div>
          <ul v-if="!isLoading">
            <li v-for="(post, index) in posts" v-bind:key="index">
              <p class="message-item-body">{{ post.body }}</p>
              <p class="message-item-author">{{ post.author }}</p>
              <p class="message-item-date">{{ post.date }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const initGeetest = window.initGeetest
export default {
  data () {
    return {
      prompt: '',
      message: '',
      isLoading: false,
      isCircleLoading: false,
      posts: [],
      captchaObj: ''
    }
  },
  created () {
    this.fetchData()
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
            url: this.$api.indexAPI.postMessage,
            data: {
              geetest_challenge: result.geetest_challenge,
              geetest_validate: result.geetest_validate,
              geetest_seccode: result.geetest_seccode,
              content: this.message
            },
            withCredentials: true
          }).then((res) => {
            const data = res.data
            if (data.status === 0) {
              this.fetchData()
              this.$root.eventHub.$emit('showAlert', '已提交,审核中', 1)
            } else {
              this.$root.eventHub.$emit('showAlert', data.msg)
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
    //
    //         $.ajax({
    //           url: this.$api.indexAPI.postMessage,
    //           type: 'post',
    //           data: {
    //             geetest_challenge: result.geetest_challenge,
    //             geetest_validate: result.geetest_validate,
    //             geetest_seccode: result.geetest_seccode,
    //             content: this.message
    //           },
    //           beforeSend: () => {
    //             this.isLoading = true
    //           },
    //           success: (data) => {
    //             if (data.status === 0) {
    //               this.fetchData()
    //               this.$root.eventHub.$emit('showAlert', '已提交,审核中', 1)
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
    submit () {
      if (this.message.length < 10) {
        this.prompt = '多写些吧，不少于10字哦～'
        return
      }
      if (this.message.length > 140) {
        this.prompt = '长话短说，不要超过140字哦～'
        return
      }
      this.prompt = ''
      this.captchaObj.verify()
    },
    fetchData () {
      this.isCircleLoading = true
      this.$http.get(this.$api.indexAPI.message).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.posts = data.content
          this.isCircleLoading = false
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/indexAPI/message',
      //   method: 'get',
      //   data: {},
      //   beforeSend: () => {
      //     this.isCircleLoading = true
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.posts = data.content
      //       this.isCircleLoading = false
      //     } else {
      //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      //     }
      //   }
      // })
    }
  }
}
</script>

<style src="../../assets/css/body-wrapper.css"></style>

<style scoped>
  .message-container {
    margin: 0 auto;
    text-align: center;
  }

  .message-body {
    margin: 0 auto;
    background: url("../../assets/img/woodboard.jpg");
    background-size: cover;
    border: 1px solid brown;
    border-radius: 5px;
    width: 60%;
    height: 100%;
    min-height: 880px;
    padding: 100px 30px 50px 50px;
    position: relative;
  }

  .message-body .message-change-btn {
    width: 100px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: rgba(204, 204, 204, 0.53);
    border-radius: 10px;
    line-height: 30px;
    cursor: pointer;
    user-select: none;
  }

  .message-body .message-change-btn:hover {
    background-color: rgba(168, 168, 168, 0.53);
  }

  .message-body .message-change-btn:active {
    background-color: rgba(129, 129, 129, 0.53);
  }

  i.icon.loading {
    animation: icon-loading .6s linear infinite !important;
  }

  .message-body ul li {
    text-decoration: none;
    list-style: none;
    display: inline-block;
    height: 200px;
    width: 33%;
    padding: 20px;
    position: relative;
    animation: show 0.8s;
    float: left;
    text-align: center;
  }

  .message-body ul li:before {
    content: "";
    width: 40%;
    height: 30px;
    /*background-color: rgba(222, 222, 222, 0.86);*/
    background-color: rgba(255, 255, 204, 0.65);
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    display: inline-block;
    position: absolute;
    left: 32%;
    top: -12px;
  }

  .message-body ul:after {
    content: "";
    clear: both;
    display: block;
  }

  .message-body ul li:nth-child(5n+1) {
    background-color: rgba(143, 188, 143, 0.55);
  }

  .message-body ul li:nth-child(5n+2) {
    background-color: rgba(182, 102, 188, 0.55);
  }

  .message-body ul li:nth-child(5n+3) {
    background-color: rgba(188, 179, 38, 0.55);
  }

  .message-body ul li:nth-child(5n+4) {
    background-color: rgba(188, 92, 119, 0.55);
  }

  .message-body ul li:nth-child(5n) {
    background-color: rgba(117, 159, 188, 0.55);
  }

  .message-body ul li:nth-child(4n+1) {
    transform: rotate(-2deg);
  }

  .message-body ul li:nth-child(4n+2) {
    transform: rotate(2deg);
  }

  .message-body ul li:nth-child(4n+3) {
    transform: rotate(-4deg);
  }

  .message-body ul li:nth-child(4n) {
    transform: rotate(4deg);
  }

  .message-form {
    width: 60%;
    margin: 0 auto 30px auto;
    display: inline-block;
    border: 3px dashed #ccc;

  }

  .message-form .field {
    display: inline-block;
    width: 70%;
    height: 100%;
    margin-top: 18px !important;
  }

  .message-form textarea {
    resize: none !important;
  }

  .message-form .message-submit {
    display: inline-block;
    width: 20%;
    float: right;
    margin-top: 20px;
    margin-right: 20px;
  }

  .message-submit {
    background-color: #1B9AF7;
    border-color: #1B9AF7;
    border-radius: 200px;
    color: #FFF;
    font-weight: 300;
    font-size: 16px;
    font-family: "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    text-decoration: none;
    text-align: center;
    line-height: 40px;
    height: 40px;
    padding: 0 40px;
    margin: 0;
    display: inline-block;
    cursor: pointer;
    border: none;
    position: relative;
    box-shadow: 0 7px 0 #077ace, 0 8px 3px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    transition-property: top;
    transition-duration: .6s;
    outline: none;
  }

  .message-submit:hover {
    box-shadow: 0 7px 0 #077ace, 0 8px 3px rgba(0, 0, 0, 0.3);
    background-color: #4cb0f9;
    border-color: #4cb0f9;
    color: #FFF;
  }

  .message-submit:active {
    box-shadow: 0 2px 0 #0662a6, 0 3px 3px rgba(0, 0, 0, 0.2);
    background-color: #2798eb;
    border-color: #2798eb;
    color: #cccccc;
    top: 5px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
    text-decoration: none;
    transition-duration: .3s;
  }

  .message-form span {
    position: absolute;
    right: 0;
    width: 245px;
    bottom: 12px;
    color: red;
  }

  .message-item-body {

  }

  .message-item-author {
    text-align: right;
  }

  .message-item-date {
    text-align: right;
  }

  @keyframes show {
    0% {
      opacity: 0.1;
    }
    100% {
      opacity: 1;
    }
  }
</style>
