<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <search placeholder="输入关键词搜索相关资源" v-on:requestSearch="receiveSearch"></search>
      <div class="resource-container">
        <div class="resource-table">
          <div class="resource-table-tab">
            <a class="ui button tiny green" v-for="(type,index) in types" v-bind:key="index"
               v-on:click="typeChange(index)"
               v-bind:class="{basic:activeTypeIndex!=index}">
              {{ type }}
            </a>
          </div>
          <div class="resource-table-body ui segment">
            <div class="ui inverted dimmer" v-bind:class="{active:isLoading}">
              <div class="ui text loader">Loading</div>
            </div>
            <table class="ui celled  single line striped selectable table ">
              <thead>
              <tr class="center aligned">
                <th class="five wide">文件名</th>
                <th class="four wide">描述</th>
                <th class="one wide">下载次数</th>
                <th class="two wide">时间</th>
                <th class="two wide">权限</th>
                <th class="two wide">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(file, index) in files" v-bind:key="index" class="center aligned">
                <td class="collapsing"><i class="folder icon"></i>{{ file.name }}</td>
                <td>{{ file.desc}}</td>
                <td class="collapsing">{{ file.downloadNum }}</td>
                <td class="collapsing">{{ file.date }}</td>
                <td class="collapsing">{{ file.auth }}</td>

                <td class="collapsing">
                  <router-link :to="'/resource/content/'+file.url">
                    <button class="ui inverted blue small button">下载</button>
                  </router-link>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <page :all_items="allItems" :page_size="8"
            :current_page="currentPage" v-on:changePage="pageChange"></page>
    </div>
  </div>
</template>

<script>
import search from '../util/search.vue'
import page from '../util/page.vue'

const $ = window.$
export default {
  data () {
    return {
      allItems: 1,
      currentPage: 1,
      searchStr: null,
      isLoading: false,
      types: ['全部', '文档', '软件', '数据', '视频', '图片', '其他'],
      activeTypeIndex: 0,
      files: []
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
    receiveSearch (msg) {
      this.searchStr = msg
      this.fetchData()
    },
    typeChange (index) {
      this.activeTypeIndex = index
      this.fetchData()
    },
    pageChange (page) {
      this.page = page
      this.fetchData()
    },
    fetchData () {
      this.isLoading = true
      this.$http.get(this.$api.indexAPI.resource, {
        params: {page: this.currentPage, keyword: this.searchStr, type: this.activeTypeIndex}
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.files = data.content
          this.allItems = data.allItems ? data.allItems : this.allItems
          $(window).scrollTop = 0
          this.isLoading = false
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/indexAPI/resource',
      //   method: 'get',
      //   data: {page: this.currentPage, keyword: this.searchStr, type: this.activeTypeIndex},
      //   beforeSend: () => {
      //     this.isLoading = true
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.files = data.content
      //       this.allItems = data.allItems ? data.allItems : this.allItems
      //       $(window).scrollTop = 0
      //       this.isLoading = false
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
  .resource-container {
    width: 100%;
    margin: 40px auto;
    text-align: center;
  }

  .resource-table {
    width: 60%;
    margin: 0 auto;
  }

  .resource-table-tab {
    text-align: left;
    margin-bottom: 20px;
  }

  table td {
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
  }
</style>
