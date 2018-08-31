<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <search placeholder="输入关键词搜索相关问题" v-on:requestSearch="receiveSearch"></search>
      <div class="question-container">
        <div v-if="questions.length>0">
          <question-item v-for="(question, index) in questions"
                         v-bind:question="question"
                         v-bind:key="index">
          </question-item>
        </div>
        <div class="emptyPrompt" v-else>o(╯□╰)o 什么都没有哦～～</div>
      </div>
      <page v-if="showArti" :all_items="allItems" :page_size="8"
            :current_page="currentPage" v-on:changePage="pageChange"></page>
    </div>
  </div>
</template>

<script>
import qi from '../util/question-item.vue'
import page from '../util/page.vue'
import search from '../util/search.vue'

const $ = window.$
export default {
  data () {
    return {
      allItems: 1,
      currentPage: 1,
      searchStr: null,
      showArti: false,
      questions: []
    }
  },
  components: {
    questionItem: qi,
    page: page,
    search: search
  },
  created () {
    this.fetchData()
  },
  methods: {
    receiveSearch (searchStr) {
      this.searchStr = searchStr
      this.fetchData()
    },
    pageChange (page) {
      this.currentPage = page
      this.fetchData()
    },
    fetchData () {
      // get knowledge
      this.showArti = false

      this.$http.get(this.$api.indexAPI.question, {
        params: {page: this.currentPage, keyword: this.searchStr}
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.questions = data.content
          this.allItems = data.allItems ? data.allItems : this.allItems
          $(window).scrollTop = 0
          this.showArti = true
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/indexAPI/question',
      //   method: 'get',
      //   data: {page: this.currentPage, keyword: this.searchStr},
      //   beforeSend: () => {
      //     this.showArti = false
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.questions = data.content
      //       this.allItems = data.allItems ? data.allItems : this.allItems
      //       $(window).scrollTop = 0
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

<style src="../../assets/css/body-wrapper.css"></style>

<style scoped>
  .question-container {
    text-align: center;
    padding-top: 60px;
  }

  .question-container article {
    width: 60%;
    height: 100%;
    margin: 0 auto;
    margin-bottom: 30px;
    border-radius: 2px;
    border: 1px solid #ccc;
    position: relative;
    transition: height .8s;
    animation: load .2s;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  .question-container article:nth-child(1) {
    animation-delay: 0.2s;
  }

  .question-container article:nth-child(2) {
    animation-delay: 0.3s;
  }

  .question-container article:nth-child(3) {
    animation-delay: 0.4s;
  }

  .question-container article:nth-child(4) {
    animation-delay: 0.5s;
  }

  .question-container article:nth-child(5) {
    animation-delay: 0.6s;
  }

  .question-container article:nth-child(6) {
    animation-delay: 0.7s;
  }

  .question-container article:nth-child(7) {
    animation-delay: 0.8s;
  }

  .question-container article:nth-child(8) {
    animation-delay: 0.9s;
  }

  @keyframes load {
    0% {
      transform: translateY(10px);
      opacity: 0;
    }
    40% {
      transform: translateY(5px);
      opacity: 0.5;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
