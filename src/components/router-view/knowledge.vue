<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <search placeholder="输入关键词搜索相关文章" v-on:requestSearch="receiveSearch"></search>
      <div class="knowledge-container">
        <div v-if="articles.length >0">
          <article v-for="(arti,index) in articles" v-bind:key="index" v-if="showArti">
            <router-link :to="'/knowledge/content/'+arti.url">
              <h3 class="article-title">
                {{ arti.title }}
              </h3>
              <span class="article-label">
                <a class="ui label tag olive"
                   v-bind:href="'/knowledge/tag/'+tag" v-for="(tag, index) in arti.tags" v-bind:key="index">{{tag}}</a>
              </span>
              <p class="article-summary">
                {{( arti.desc === '') || (arti.desc === undefined) ? '此文章没有简介' : arti.desc}}
              </p>
              <span class="ui label basic blue">
                            浏览量:{{ arti.view }}
                        </span>
              <span class="ui label basic teal">
                            {{ arti.date }}
                        </span>
              <span>
                            <a class="article-readMore">
                                <span>阅读全文</span>
                            </a>
                        </span>
            </router-link>
          </article>
        </div>
        <div class="emptyPrompt" v-else>o(╯□╰)o 什么都没有哦～～</div>
      </div>
      <page v-if="showArti" :all_items="allItems" :page_size="8"
            :current_page="currentPage" v-on:changePage="pageChange"></page>
    </div>
  </div>
</template>

<script>
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
      articles: []
    }
  },
  components: {
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
      this.$http.get(this.$api.indexAPI.knowledge, {
        params: {page: this.currentPage, keyword: this.searchStr}
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.articles = data.content
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
      //   url: '/indexAPI/knowledge',
      //   type: 'get',
      //   data: {page: this.currentPage, keyword: this.searchStr},
      //   beforeSend: () => {
      //     this.showArti = false
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.articles = data.content
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
<style src="../../assets/css/knowledge.css"></style>

<style scoped>
  .knowledge-container {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    padding-top: 50px;
  }
</style>
