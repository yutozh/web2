<template>
  <div class="home-knowledge-container">
    <div class="home-section-title">
      <span>最近写了啥</span>
    </div>
    <div class="home-section-body">
      <div v-if="showArti">
        <article v-for="(arti, index) in articles" v-bind:key="index">
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
    <router-link to="/knowledge" class="home-section-more">
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
      articles: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.showArti = false
      this.$http.get(this.$api.indexAPI.homeKnowledge).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.articles = data.content
          this.showArti = true
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/indexAPI/homeKnowledge',
      //   method: 'get',
      //   data: {},
      //   beforeSend: () => {
      //     this.showArti = false
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.articles = data.content
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

<style src="../../../assets/css/knowledge.css"></style>
