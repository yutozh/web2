<template>
  <div class="admin-content-wrapper">
    <div class="ui modal admin-modal-running">
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
      <h2 class="ui header violet">
        <i class="student icon"></i>
        <div class="content">
          应用管理
          <div class="sub header">健康管理</div>
        </div>
      </h2>
    </div>
    <a href="/app/running" target="_blank">查看健康统计信息</a>
    <table class="ui celled padded table">
      <thead>
      <tr>
        <th class="single line center aligned">序号</th>
        <th class="center aligned">日期</th>
        <th class="center aligned">体重</th>
        <th class="center aligned">脂肪</th>
        <th class="center aligned">跑步里程</th>
        <th class="center aligned">步数</th>
        <th class="center aligned">饮食</th>
        <th class="center aligned">删除</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="center aligned">
          <h4 class="ui center aligned header">新数据</h4>
        </td>
        <td class="center aligned">
          <div class="ui mini input"><input class="center aligned" v-model="newdata.datetime"></div>
        </td>
        <td class="center aligned">
          <div class="ui mini input"><input class="center aligned" v-model="newdata.weight"></div>
        </td>
        <td class="center aligned">
          <div class="ui mini input"><input class="center aligned" v-model="newdata.fat"></div>
        </td>
        <td class="center aligned">
          <div class="ui mini input"><input class="center aligned" v-model="newdata.runLen"></div>
        </td>
        <td class="center aligned">
          <div class="ui mini input"><input class="center aligned" v-model="newdata.walkLen"></div>
        </td>
        <td class="center aligned">
          <div class="ui mini input"><input class="center aligned" v-model="newdata.food"></div>
        </td>
        <td class="center aligned">
          <button class="ui button blue basic"
                  v-on:click="addRunning">
            添加
          </button>
        </td>
      </tr>

      <tr v-for="(data, index) in datum" v-bind:key="index">
        <td class="center aligned">
          <h4 class="ui center aligned header">{{ (currentPage - 1) * 10 + index + 1 }}</h4>
        </td>
        <td class="center aligned">{{ dateFormatConvert(data.datetime) }}</td>
        <td class="center aligned">{{ data.weight }}</td>
        <td class="center aligned">{{ data.fat }}</td>
        <td class="center aligned">{{ data.runLen }}</td>
        <td class="center aligned">{{ data.walkLen }}</td>
        <td class="center aligned">{{ data.food }}</td>
        <td class="center aligned">
          <button class="ui button red basic"
                  v-on:click="deleteRunning(data.datetime)">
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
      selected: [],
      datum: [],
      newdata: {datetime: '', weight: '', fat: '', runLen: '', walkLen: '', food: ''}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    dateFormatConvert: function (date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },
    pageChange (page) {
      this.currentPage = page
      this.fetchData()
    },
    fetchData () {
      this.$http.get(this.$api.appAPI.getRunningDatasAdmin, {
        params: {page: this.currentPage}
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
      //   url: '/appAPI/getRunningDatasAdmin',
      //   method: 'get',
      //   data: {page: this.currentPage},
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
    deleteRunning (datetime) {
      $('.admin-modal-running').modal({
        onDeny: () => {
        },
        onApprove: () => {
          this.$http.post(this.$api.appAPI.postDeleteRunningDatasAdmin, {
            datetime: datetime
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
          //   url: '/appAPI/postDeleteRunningDatasAdmin',
          //   type: 'post',
          //   data: {datetime: datetime},
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
    },
    addRunning () {
      this.$http.post(this.$api.appAPI.postAddRunningDatasAdmin, {
        datetime: this.newdata.datetime,
        weight: this.newdata.weight,
        fat: this.newdata.fat,
        runLen: this.newdata.runLen,
        walkLen: this.newdata.walkLen,
        food: this.newdata.food
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.$root.eventHub.$emit('showAlert', '操作成功', 1)
          this.fetchData()
        } else {
          this.$root.eventHub.$emit('showAlert', data.msg)
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/appAPI/postAddRunningDatasAdmin',
      //   type: 'post',
      //   data: {
      //     datetime: this.newdata.datetime,
      //     weight: this.newdata.weight,
      //     fat: this.newdata.fat,
      //     runLen: this.newdata.runLen,
      //     walkLen: this.newdata.walkLen,
      //     food: this.newdata.food
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.$root.eventHub.$emit('showAlert', '操作成功', 1)
      //       this.fetchData()
      //     } else {
      //       this.$root.eventHub.$emit('showAlert', data.msg)
      //     }
      //   }
      // })
    }
  },
  components: {
    page: page
  }
}

</script>

<style scoped>
  .content-option {
    text-align: left;
  }
</style>
