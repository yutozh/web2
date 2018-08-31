<template>
  <div class="home-question-container">
    <div class="home-section-title">
      <span>遇到的问题</span>
    </div>
    <div class="home-section-body">
      <div class="question-block-wrapper">
        <div v-if="showArti">
          <!--<div class="question-block-arrow-left"></div>-->
          <!--<div class="question-block-arrow-right"></div>-->

          <div class="question-block" v-for="(question, index) in questions" v-bind:key="index">
            <router-link :to="'question/content/'+question.url">
              <div class="question-content">
                <div class="question-title">{{ question.title }}</div>
                <div class="question-answer" v-html="question.body"></div>
              </div>
              <div class="question-span ui buttons">
                <button class="question-like ui basic teal button">
                  <i class="thumbs outline up icon"></i>{{ question.pros }}
                </button>
                <button class="question-dislike ui basic teal button">
                  <i class="thumbs outline down icon"></i>{{ question.cons }}
                </button>
              </div>
            </router-link>
          </div>
        </div>
        <div class="emptyPrompt" v-else>o(╯□╰)o 什么都没有哦～～</div>
      </div>
    </div>
    <router-link to="question" class="home-section-more">
            <span>
            更多
            </span>
    </router-link>
    <div class="home-section-split"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showArti: false,
      questions: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.showArti = false
      this.$http.get(this.$api.indexAPI.homeQuestion).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.questions = data.content
          this.showArti = true
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/indexAPI/homeQuestion',
      //   method: 'get',
      //   data: {},
      //   beforeSend: () => {
      //     this.showArti = false
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.questions = data.content
      //       this.showArti = true
      //     } else {
      //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      //     }
      //   }
      // })
    }
  }
}
</script>

<style scoped>
  .question-block-wrapper {
    position: relative;
  }

  .question-block-arrow-left {
    position: absolute;
    left: 120px;
    top: 46%;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background: red;
    content: "";
    background: url("../../../assets/img/arrow.png") no-repeat;
    background-size: cover;
    cursor: pointer;
  }

  .question-block-arrow-left:hover {
    box-shadow: 0 0 40px #c1c6cc;
  }

  .question-block-arrow-right {
    position: absolute;
    right: 120px;
    top: 46%;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background: red;
    content: "";
    background: url("../../../assets/img/arrow.png") no-repeat -62px;
    background-size: cover;
    cursor: pointer;
  }

  .question-block-arrow-right:hover {
    box-shadow: 0 0 40px #90ccab;
  }

  .question-block {
    display: inline-block;
    width: 22%;
    margin: 10px 30px;
    box-shadow: 0 0 40px #ccc;
    transition: transform 0.2s;
  }

  .question-block:hover {
    transform: translateY(-5px);
  }

  .question-content {
    border: 1px solid rgb(84, 200, 255);
    border-radius: 3px;
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: 12px;
  }

  .question-title {
    margin: 10px 12px;
    text-align: center;
    color: darkolivegreen;
    font-size: large;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .question-answer {
    color: black;
    height: 200px;
    word-break: break-all;
    margin: 10px 18px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .question-span {
    position: relative;
    width: 100%;
    margin-top: -4px !important;
  }

  .question-like {
    width: 50%;
  }

  .question-dislike {
    width: 50%;
  }
</style>
