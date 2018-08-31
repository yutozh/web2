<template>
  <div class="admin-content-wrapper">
    <div class="ui modal admin-modal-4">
      <div class="header">提示</div>
      <div class="content">
        <h3>确认吗？</h3>
      </div>
      <div class="actions">
        <div class="ui negative button">取消</div>
        <div class="ui positive button">确认</div>
      </div>
    </div>
    <div class="ui modal resource-set">
      <i class="close icon"></i>
      <div class="header">
        修改资源信息
      </div>
      <div class="content">
        <form class="ui form">
          <div class="field">
            <label>描述</label>
            <textarea rows="3" placeholder="填写文件描述信息"
                      v-model="modalData.desc"></textarea>
          </div>
          <div class="field">
            <label>详细信息</label>
            <textarea rows="3" placeholder="填写文件详细信息"
                      v-model="modalData.detail"></textarea>
          </div>
          <div class="field">
            <label>权限</label>
            <div class="inline fields">
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" name="auth" value="公开" v-model="modalData.auth" tabindex="0" class="hidden">
                  <label>公开</label>
                </div>
              </div>
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" name="auth" value="私有" v-model="modalData.auth" tabindex="0" class="hidden">
                  <label>私有</label>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>密钥</label>
            <input type="text" placeholder="输入密钥..." v-model="modalData.password"/>
          </div>
        </form>
      </div>
      <div class="actions">
        <div class="ui black deny button">
          取消
        </div>
        <div class="ui positive  button" :class="{loading:modalLoading}">
          确定
        </div>
      </div>
    </div>

    <div class="content-tilte">
      <h2 class="ui header orange">
        <i class="student icon"></i>
        <div class="content">
          内容管理
          <div class="sub header">资源站</div>
        </div>
      </h2>
    </div>
    <div class="content-option">
      <router-link to="/addResource">
        <button class="ui button small yellow">
          <i class="plus icon"></i>
          添加资源
        </button>
      </router-link>
    </div>
    <table class="ui celled padded table">
      <thead>
      <tr>
        <th class="single line center aligned">序号</th>
        <th class="center aligned">文件名</th>
        <th class="center aligned">大小</th>
        <th class="center aligned">下载量</th>
        <th class="center aligned">类型</th>
        <th class="center aligned">作者</th>
        <th class="center aligned">权限</th>
        <th class="center aligned">日期</th>
        <th class="center aligned">隐藏</th>
        <th class="center aligned">编辑</th>
        <th class="center aligned">删除</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(data, index) in datum" v-bind:key="index">
        <td class="center aligned">
          <h4 class="ui center aligned header">{{ (currentPage-1)*10+index+1 }}</h4>
        </td>
        <td>
          <a :href="'/resource/content/'+data.url">{{ data.name }}</a>
        </td>
        <td class="center aligned">{{ data.size }}</td>
        <td class="center aligned">{{ data.downloadNum }}</td>
        <td class="center aligned">{{ data.type }}</td>
        <td class="center aligned">{{ data.author }}</td>
        <td class="center aligned">{{ data.auth }}</td>
        <td class="center aligned">{{ data.date }}</td>
        <td class="center aligned">
          <div class="ui toggle checkbox">
            <input type="checkbox" :checked="data.hide" v-on:click="hideHandle(data.url, $event)">
            <label></label>
          </div>
        </td>
        <td class="center aligned">
          <button class="ui button blue basic"
                  v-on:click="showModal(index)">编辑
          </button>
        </td>
        <td class="center aligned">
          <button class="ui button red basic"
                  v-on:click="deleteResource(data.url)">
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
      datum: [],
      modalData: {},
      modalLoading: false
    }
  },
  created () {
    this.fetchData()
  },
  destroyed () {
    $('.ui.dimmer.modals.page.transition').remove()
  },
  methods: {
    pageChange (page) {
      this.currentPage = page
      this.fetchData()
    },
    fetchData () {
      this.$http.get(this.$api.adminAPI.getLists, {
        params: {target: 'modelResource', page: this.currentPage}
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
      //   data: {target: 'modelResource', page: this.currentPage},
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
    hideHandle (url, event) {
      this.$http.post(this.$api.adminAPI.postChangeContents, {
        target: 'modelResource',
        changeItem: 'hide',
        value: event.target.checked,
        path: url
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
      //     target: 'modelResource', changeItem: 'hide',
      //     value: event.target.checked, path: url
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
    deleteResource (url) {
      $('.admin-modal-4').modal({
        onDeny: () => {
        },
        onApprove: () => {
          this.$http.post(this.$api.adminAPI.postDeleteContents, {
            target: 'modelResource', path: url
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
          //   data: {target: 'modelResource', path: url},
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
    showModal (index) {
      let that = this

      $('.ui.radio.checkbox').checkbox({
        onChecked: function () {
          that.modalData.auth = $(this).val()
        }
      })
      this.modalData = this.datum[parseInt(index)]
      $('.ui.modal.resource-set').modal({
        onApprove: () => {
          this.modalLoading = true

          this.$http.post(this.$api.adminAPI.postDeleteContents, {
            url: this.modalData.url,
            desc: this.modalData.desc,
            detail: this.modalData.detail,
            auth: this.modalData.auth,
            password: this.modalData.password
          }).then((res) => {
            const data = res.data
            if (data.status === 0) {
              this.$root.eventHub.$emit('showAlert', '操作成功', 1)
              this.fetchData()
            } else {
              this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
            }
            this.modalLoading = false
            $('.ui.modal.resource-set').modal('hide')
          }).catch((e) => {
            this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
            console.log(e)
          })
          // $.ajax({
          //   url: '/adminAPI/updateResInfo',
          //   type: 'post',
          //   data: {
          //     url: this.modalData.url, desc: this.modalData.desc, detail: this.modalData.detail,
          //     auth: this.modalData.auth, password: this.modalData.password
          //   },
          //   beforeSend: () => {
          //     this.modalLoading = true
          //   },
          //   success: (data) => {
          //     if (data.status === 0) {
          //       this.$root.eventHub.$emit('showAlert', '操作成功', 1)
          //       this.fetchData()
          //     } else {
          //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
          //     }
          //     this.modalLoading = false
          //     $('.ui.modal.resource-set').modal('hide')
          //   }
          // })
          return false
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
