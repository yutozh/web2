<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <div class="question-content-container">
        <div class="content-title"><i class="help icon circular teal inverted"></i> {{ question.title }}</div>

        <div class="content-body" v-html="question.body"></div>
        <div class="content-info">
          <span>创建日期:{{ question.date }}</span>
          <span v-if="question.upDate">更新日期:{{ question.upDate }}</span>
          <span>浏览:{{ question.view }}</span>
        </div>
        <div class="content-extends">
                    <span>
                        <button class="ui red large button content-like-plus" v-on:click="vote(1)">
                            <i class="thumbs up icon" v-bind:class="{outline:voted===0}"></i>
                            <span v-if="voted>0">{{ question.pros }}</span>
                            <span v-else>赞</span>
                            <span class="plus1" v-if="voted===1">+1</span>
                        </button>
                        <button class="ui green large button content-like-plus" v-on:click="vote(2)">
                            <i class="thumbs down icon" v-bind:class="{outline:voted===0}"></i>
                            <span v-if="voted>0">{{ question.cons }}</span>
                            <span v-else>踩</span>
                            <span class="plus1" v-if="voted===2">+1</span>
                        </button>
                    </span>
          <span class="classes-item" v-for="tag in question.tags" v-bind:key="tag">
                        <router-link class="ui blue tag label" :to="'/question/tag/'+tag">{{ tag }}</router-link>
                    </span>
        </div>
        <share></share>
        <back :backroute="backroute"></back>
        <div class="ui divider"></div>
        <comment :sid="questionPath"></comment>
      </div>
    </div>
  </div>
</template>

<script>
import Prism from 'prismjs'
import 'prismjs/themes/prism-coy.css'
import share from '../util/share.vue'
import comment from '../util/comment.vue'
import back from '../util/back.vue'

export default {
  data () {
    return {
      backroute: '/',
      questionPath: this.$route.params.name,
      question: {},
      voted: 0
    }
  },
  created () {
    // 请求问题数据
    this.$http.get(this.$api.indexAPI.questionContent, {
      params: {path: this.questionPath}
    }).then((res) => {
      const data = res.data
      if (data.status === 0) {
        if (data.content === null) {
          this.$root.$router.push({path: '/404'})
          return
        }
        this.question = data.content
        setTimeout(function () {
          Prism.highlightAll()
        }, 100)
      } else {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      }
    }).catch((e) => {
      this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      console.log(e)
    })
    // $.ajax({
    //   url: '/indexAPI/questionContent',
    //   method: 'get',
    //   data: {path: this.questionPath},
    //   beforeSend: () => {
    //
    //   },
    //   success: (data) => {
    //     if (data.status === 0) {
    //       if (data.content === null) {
    //         this.$root.$router.push({path: '/404'})
    //         return
    //       }
    //       this.question = data.content
    //       // 代码高亮
    //       setTimeout(function () {
    //         let docPre = $('.content-body pre')
    //         docPre.each(function () {
    //           let classVal = $(this).attr('class')
    //           let classArr = []
    //           classArr = classVal.split(';')
    //           classArr = classArr['0'].split(':')
    //           let lanClass = 'language-' + classArr['1']
    //           let preContent = '<code class="' + lanClass + '">' + $(this).html() + '</code>'
    //           $(this).html(preContent)
    //           $(this).attr('class', 'line-numbers ' + lanClass)
    //         })
    //       }, 50)
    //       setTimeout(function () {
    //         (function () {
    //           let hm = document.createElement('script')
    //           hm.src = '/js/prism.js'
    //           let s = document.getElementsByTagName('script')[0]
    //           s.parentNode.insertBefore(hm, s)
    //         })()
    //       }, 100)
    //     } else {
    //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
    //     }
    //   }
    // })
  },
  methods: {
    vote (pc) {
      // 提交喜欢
      if (this.voted > 0) {
        return
      }
      if (pc === 1) {
        this.voted = 1
      } else if (pc === 2) {
        this.voted = 2
      }
      this.submitVote(pc)
    },
    submitVote (pc) {
      this.$http.post(this.$api.indexAPI.questionVote, {
        path: this.questionPath, pc: pc
      }).then((res) => {
        const data = res.data
        if (data.status === -1) {
          alert('您的操作频率过快,请稍后重试')
        } else if (data.status < 0) {
          alert('服务器错误，请稍后再试')
          this.voted = 0
        } else {
          if (pc === 1) {
            this.question.pros += 1
          } else if (pc === 2) {
            this.question.cons += 1
          }
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/indexAPI/questionVote',
      //   method: 'post',
      //   data: {path: this.questionPath, pc: pc},
      //   beforeSend: () => {
      //
      //   },
      //   success: (data) => {
      //     if (data.status === -1) {
      //       alert('您的操作频率过快,请稍后重试')
      //     } else if (data.status < 0) {
      //       alert('服务器错误，请稍后再试')
      //       this.voted = 0
      //     } else {
      //       if (pc === 1) {
      //         this.question.pros += 1
      //       } else if (pc === 2) {
      //         this.question.cons += 1
      //       }
      //     }
      //   }
      // })
    }
  },
  components: {
    share: share,
    comment: comment,
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
  .question-content-container {
    width: 60%;
    text-align: center;
    margin: 0 auto;
  }

  .content-title {
    text-align: left;
    font-size: x-large;
    word-break: break-all;
    line-height: 40px;
  }

  .content-body {
    font-size: large;
    line-height: 30px;
    word-break: break-all;
    margin: 20px auto;
    text-align: left;
  }

  .content-info {
    text-align: left;
    color: purple;
  }

  .content-info span {
    margin: 0 0.5em;
  }

  .content-extends {
    text-align: left;
    margin-bottom: 20px;
  }

  .classes-item {
    float: right;
    line-height: 40px;
    margin-right: 5px;
  }

  .content-like-plus {
    position: relative;
    margin-right: 30px !important;
  }

  .content-like-plus::after {
    display: block;
    content: "";
    clear: both;
  }

  .plus1 {
    animation: bigtosmall 1.0s;
    animation-fill-mode: forwards;
    display: inline-block;
    float: right;
    position: absolute;
    right: 2px;
    bottom: 12px;
  }

  @keyframes bigtosmall {
    0% {
      transform: translateY(10px);
      opacity: 0;
    }
    50% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-10px);
      opacity: 0;
    }
  }
</style>
