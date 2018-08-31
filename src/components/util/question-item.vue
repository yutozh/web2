<template>
  <article>
    <div class="question-title">
      <router-link :to="'question/content/'+question.url">{{ question.title }}</router-link>
    </div>
    <div class="question-body" v-bind:class="{'question-body-full':isContentShowFull}"
         v-html="question.body">
    </div>
    <div class="question-show-all" v-on:click="toggleFull">{{ showFullBtnContent }}</div>
    <div class="question-span">
      <div class="span-item">
        <a class="question-comment" v-on:click="toggleComment">
          <i class="comment icon" v-bind:class="{outline:!isCommentShow,active:isCommentShow}">
            {{ commentBtnContent }}
          </i>
        </a>
      </div>
      <div class="span-item" v-on:click="toggleShare">
        <a class="question-share">
          <i class="share alternate icon">分享</i>
        </a>
        <div class="question-share-body" v-if="isShareShow">

        </div>
      </div>
      <div class="span-item" v-on:click="toggleLike">
        <a class="question-like">
          <i class="heart icon" v-bind:class="{empty:!isLike,active:isLike}">
            {{ likeBtnContent }}
          </i>
        </a>
      </div>
    </div>
    <transition name="comment-fade">
      <div class="question-comment-body ui segment" v-show="isCommentShow">
        <div class="ui inverted dimmer" v-bind:class="{active: comments===undefined}">
          <div class="ui text loader">评论系统暂未使用</div>
        </div>
        <p></p>
      </div>
    </transition>
  </article>
</template>

<script>
export default {
  props: ['question'],
  data () {
    return {
      isContentShowFull: false,
      isCommentShow: false,
      isShareShow: false,
      isLike: false,
      comments: undefined
    }
  },
  methods: {
    toggleFull () {
      this.isContentShowFull = !this.isContentShowFull
    },
    toggleComment () {
      this.isCommentShow = !this.isCommentShow
    },
    toggleShare () {
      this.isShareShow = !this.isShareShow
      this.comments = [{}, {}]
    },
    toggleLike () {
      this.isLike = !this.isLike
    }
  },
  computed: {
    showFullBtnContent () {
      return this.isContentShowFull ? '收起' : '展开全文'
    },
    commentBtnContent () {
      return this.isCommentShow ? '收起评论' : '评论'
    },
    shareBtnContent () {
      return false
    },
    likeBtnContent () {
      return this.isLike ? '已喜欢' : '喜欢'
    },
    likeClass () {
      return ''
    }
  }
}
</script>

<style scoped>
  .question-title {
    display: block;
    width: 100%;
    height: 30px;
    font-size: 20px;
    font-weight: bolder;
    text-align: left;
    padding: 20px 12px;
    color: #6496ea;
  }

  .question-title::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    clear: both;
  }

  .question-title a:hover {
    text-decoration: underline;
  }

  .question-body {
    padding: 15px 20px;
    font-size: 18px;
    line-height: 24px;
    text-align: left;
    position: relative;
    max-height: 200px;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
    color: transparent;
    background-image: linear-gradient(rgb(0, 0, 0) 80%, rgba(255, 255, 255, .2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .question-body.question-body-full {
    height: 100% !important;
    max-height: none !important;
    background-image: linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0));
  }

  .question-show-all {
    cursor: pointer;
    color: deepskyblue;
    background: linear-gradient(rgba(255, 255, 255, .2), rgba(234, 234, 234, 0.42) 100%);
    height: 70px;
    font-size: 15px;
    margin-top: -40px;
    padding-top: 40px;
  }

  .question-span {
    background: #f8f8f8;
    height: 30px;
  }

  .span-item {
    display: inline-block;
    width: 20%;
  }

  .question-span i {
    line-height: 30px;
    font-size: 16px;
    width: 100px;
    font-weight: 400;
  }

  .question-span i::before {
    padding-right: 5px;
  }

  .question-span a {
    margin-left: 10px;
    color: black;
    cursor: pointer;
  }

  .question-comment:hover, .question-comment .active {
    color: #c200ff;
    font-weight: bold;
  }

  .question-share:hover {
    color: dodgerblue;
    font-weight: bold;

  }

  .question-like:hover, .question-like .active {
    color: #d80800;
    font-weight: bold;
  }

  .question-comment-body {
    height: 300px;
    width: 100%;
    overflow-y: auto;
  }

  .question-comment-body, .comment-fade-leave-active {
    transition: all .8s
  }

  .comment-fade-enter, .comment-fade-leave-to /* .fade-leave-active in below version 2.1.8 */
  {
    opacity: 0;
    height: 0;
  }

  .comment-fade-leave, .comment-fade-enter-to {
    opacity: 1;
    height: 300px;
  }

  .ui.segment {
    border: none;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin: 0 auto !important;
  }
</style>
