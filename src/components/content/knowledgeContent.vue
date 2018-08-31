<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <div class="knowledge-content-container">
        <div class="content-title">{{ article.title }}</div>
        <div class="content-info">
          <span>发布日期:{{ article.date }}</span>
          <span v-if="article.upDate">更新日期:{{ article.upDate }}</span>
          <span>浏览:{{ article.view }}</span>
        </div>
        <div class="content-body" v-html="article.body"></div>
        <div class="content-extends">
          <span>
            <button class="ui red large button content-like-plus" v-on:click="like">
              <i class="heart icon" v-bind:class="{empty:!liked}"></i>
              <span v-if="liked">{{ article.like }}</span>
              <span v-else>喜欢</span>
              <span class="plus1" v-if="liked">+1</span>
            </button>
          </span>
          <span class="classes-item" v-for="tag in article.tags" v-bind:key="tag">
            <router-link class="ui blue tag label" :to="'/knowledge/tag/'+tag">{{ tag }}</router-link>
          </span>
        </div>
        <share></share>
        <back :backroute="backroute"></back>
        <div class="ui divider"></div>
        <comment :sid="articlePath"></comment>
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
      articlePath: this.$route.params.name,
      article: {},
      liked: false
    }
  },
  components: {
    share: share,
    comment: comment,
    back: back
  },
  created () {
    // 请求文章数据
    this.$http.get(this.$api.indexAPI.knowledgeContent, {
      params: {path: this.articlePath}
    }).then((res) => {
      const data = res.data
      if (data.status === 0) {
        if (data.content === null) {
          this.$root.$router.push({path: '/404'})
          return
        }
        this.article = data.content
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
    //   url: '/indexAPI/knowledgeContent',
    //   method: 'get',
    //   data: {path: this.articlePath},
    //   beforeSend: () => {
    //
    //   },
    //   success: (data) => {
    //     if (data.status === 0) {
    //       if (data.content === null) {
    //         this.$root.$router.push({path: '/404'})
    //         return
    //       }
    //       this.article = data.content
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
    //           var hm = document.createElement('script')
    //           hm.src = '/js/prism.js'
    //           var s = document.getElementsByTagName('script')[0]
    //           s.parentNode.insertBefore(hm, s)
    //         })()
    //       }, 100)
    //     } else {
    //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
    //     }
    //   }
    // })
  },
  mounted () {
  },
  methods: {
    like () {
      // 提交喜欢
      if (this.liked) {
        return
      }
      this.liked = true
      this.$http.post(this.$api.indexAPI.knowledgeLike, {
        path: this.articlePath
      }).then((res) => {
        const data = res.data
        if (data.status === -1) {
          alert('您的操作频率过快,请稍后重试')
        } else if (data.status < 0) {
          alert('服务器错误，请稍后再试')
          this.liked = true
        } else {
          this.article.like += 1
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/indexAPI/knowledgeLike',
      //   method: 'post',
      //   data: {path: this.articlePath},
      //   beforeSend: () => {
      //     this.liked = true
      //   },
      //   success: (data) => {
      //     if (data.status === -1) {
      //       alert('您的操作频率过快,请稍后重试')
      //     } else if (data.status < 0) {
      //       alert('服务器错误，请稍后再试')
      //       this.liked = true
      //     } else {
      //       this.article.like += 1
      //     }
      //   }
      // })
    }
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
  .knowledge-content-container {
    margin: 0 auto;
    width: 60%;
    padding: 30px;
  }

  .content-title {
    font-size: x-large;
    font-weight: bolder;
    margin-bottom: 20px;
  }

  .content-info {
    font-size: medium;
    color: #ccc;
    margin-bottom: 15px;
  }

  .content-info span {
    margin: 0 0.5em;
  }

  .content-body {
    font-size: large;
    text-align: left;
  }

  .content-extends {
    margin: 40px auto 10px auto;
    text-align: left;
    line-height: 48px;
  }

  .content-extends .classes-item {
    margin: 0 5px;
    float: right;
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
    animation: bigtosmall 1.2s;
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
