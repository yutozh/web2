<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <div class="tag-container">
        <div class="tag-title"><i class="icon tags"></i>{{ columnStr }}-标签-{{ name }}</div>
        <div class="tag-body">
          <table class="ui single line table">
            <thead>
            <tr>
              <th>标题</th>
              <th>日期</th>
              <th>点击</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in content" v-bind:key="item">
              <td>
                <router-link :to="'/'+column+'/content/'+item.url">{{ item.title }}</router-link>
              </td>
              <td>{{ item.date }}</td>
              <td>{{ item.view }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <back :backroute="backroute"></back>

      </div>
      <page :all_items="allItems" :page_size="8"
            :current_page="currentPage" v-on:changePage="pageChange"></page>
    </div>
  </div>
</template>

<script>
import page from '../util/page.vue'
import back from '../util/back.vue'

export default {
  data () {
    return {
      allItems: 1,
      currentPage: 1,
      backroute: '/',
      column: this.$route.params.column,
      name: this.$route.params.name,
      content: [
        {
          title: '测试文章测试文章测试文章测试文章测试文章测试文章测试文章',
          date: '2017-07-07',
          view: 258,
          url: 'qweqwdsadaa'
        }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    columnStr: function () {
      if (this.column === 'knowledge') {
        return '知识库'
      } else if (this.column === 'question') {
        return '问题栏'
      }
    }
  },
  methods: {
    pageChange (page) {
      this.currentPage = page
      this.fetchData()
    },
    fetchData () {
      this.$http.get(this.$api.indexAPI.tags, {
        params: {column: this.column, page: this.currentPage, tag: this.name}
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.content = data.content
          this.allItems = data.allItems ? data.allItems : this.allItems
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/indexAPI/tags',
      //   method: 'get',
      //   data: {column: this.column, page: this.currentPage, tag: this.name},
      //   beforeSend: () => {
      //
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.content = data.content
      //       this.allItems = data.allItems ? data.allItems : this.allItems
      //     } else {
      //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      //     }
      //   }
      // })
    }
  },
  components: {
    page: page,
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
  .tag-container {
    width: 60%;
    margin: 0 auto;
  }

  .tag-title {
    text-align: left;
    font-size: x-large;
    color: #1c854f;
  }

  .tag-body {
    margin: 30px 0;
  }

  .tag-body table td a {
    color: #6bcaff;
    font-weight: bold;
    font-size: medium;

  }

  .tag-body table td a:hover {
    color: darkturquoise;
  }
</style>
