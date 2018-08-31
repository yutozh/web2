<template>
  <div class="admin-content-wrapper">
    <div class="ui modal admin-modal-2">
      <div class="header">提示</div>
      <div class="content">
        <h3>确认吗？</h3>
      </div>
      <div class="actions">
        <div class="ui negative button">取消</div>
        <div class="ui positive button">确认</div>
      </div>
    </div>
    <div class="content-tilte">
      <h2 class="ui header pink">
        <i class="student icon"></i>
        <div class="content">
          内容管理
          <div class="sub header">留言板</div>
        </div>
      </h2>
    </div>
    <div class="content-option">
      <router-link to="/addKQM?type=M">
        <button class="ui button small purple">
          <i class="plus icon"></i>
          添加留言
        </button>
      </router-link>
    </div>
    <table class="ui celled padded table">
      <thead>
      <tr>
        <th class="single line center aligned">序号</th>
        <th class="center aligned">内容</th>
        <th class="center aligned">浏览量</th>
        <th class="center aligned">作者</th>
        <th class="center aligned">日期</th>
        <th class="center aligned">隐藏</th>
        <th class="center aligned">删除</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(data, index) in datum" v-bind:key="index">
        <td class="center aligned">
          <h4 class="ui center aligned header">{{ (currentPage-1)*10+index+1 }}</h4>
        </td>
        <td>
          {{ data.body }}
        </td>
        <td class="center aligned">{{ data.view }}</td>
        <td class="center aligned">{{ data.author }}</td>
        <td class="center aligned">{{ data.date }}</td>
        <td class="center aligned">
          <div class="ui toggle checkbox">
            <input type="checkbox" :checked="data.hide" v-on:click="hideHandle(data._id, $event)">
            <label></label>
          </div>
        </td>
        <td class="center aligned">
          <button class="ui button red basic"
                  v-on:click="deleteMessage(data._id)">
            删除
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <page :all_items="allItems" :page_size="10"
          :current_page="currentPage" v-on:changePage="pageChange"></page>
  </div>
</template>

<script>
import page from '@/components/util/page.vue'

const $ = window.$

export default {
  data () {
    return {
      allItems: 1,
      currentPage: 1,
      datum: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    pageChange (page) {
      this.currentPage = page
      this.fetchData()
    },
    fetchData () {
      this.$http.get(this.$api.adminAPI.getLists, {
        params: {target: 'modelMessage', page: this.currentPage}
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.datum = data.content
          this.allItems = data.allItems ? data.allItems : this.allItems
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/adminAPI/getLists',
      //   method: 'get',
      //   data: {target: 'modelMessage', page: this.currentPage},
      //   beforeSend: () => {
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.datum = data.content
      //       this.allItems = data.allItems ? data.allItems : this.allItems
      //     } else {
      //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      //     }
      //   }
      // })
    },
    hideHandle (id, event) {
      this.$http.post(this.$api.adminAPI.postChangeContents, {
        target: 'modelMessage',
        changeItem: 'hide',
        value: event.target.checked,
        path: id
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.$root.eventHub.$emit('showAlert', '操作成功', 1)
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/adminAPI/postChangeContents',
      //   method: 'post',
      //   data: {
      //     target: 'modelMessage', changeItem: 'hide',
      //     value: event.target.checked, path: id
      //   },
      //   beforeSend: () => {
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.$root.eventHub.$emit('showAlert', '操作成功', 1)
      //     } else {
      //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      //     }
      //   }
      // })
    },
    deleteMessage (id) {
      $('.admin-modal-2').modal({
        onDeny: () => {
        },
        onApprove: () => {
          this.$http.post(this.$api.adminAPI.postDeleteContents, {
            target: 'modelMessage',
            path: id
          }).then((res) => {
            const data = res.data
            if (data.status === 0) {
              this.$root.eventHub.$emit('showAlert', '操作成功', 1)
              this.fetchData()
            } else {
              this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
            }
          }).catch((e) => {
            this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
            console.log(e)
          })
          // $.ajax({
          //   url: '/adminAPI/postDeleteContents',
          //   method: 'post',
          //   data: {target: 'modelMessage', path: id},
          //   beforeSend: () => {
          //   },
          //   success: (data) => {
          //     if (data.status === 0) {
          //       this.$root.eventHub.$emit('showAlert', '操作成功', 1)
          //       this.fetchData()
          //     } else {
          //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
          //     }
          //   }
          // })
        }
      }).modal('show')
    }
  },
  components: {
    page: page
  }
}
</script>

<style>
  .content-option {
    text-align: left;
  }
</style>
