<template>
  <div class="home-resource-container">
    <div class="home-section-title">
      <span>资源与福利</span>
    </div>
    <div class="home-section-body">
      <div class="resource-wrapper ui middle aligned divided list">
        <div class="resource-item item">
          <div class="resource-item-header right floated content">
            操作
          </div>
          <p class="resource-item-header resource-item-filename content">
            文件名
          </p>
        </div>

        <div class="resource-item item" v-for="(resource, index) in resources" v-bind:key="index">
          <div class="right floated content">
            <router-link :to="'resource/content/'+resource.url">
              <div class="ui button inverted blue">下载</div>
            </router-link>
          </div>
          <div class="resource-item-icon">
            <i class="file outline icon green"></i>
          </div>
          <p class="resource-item-filename content">{{ resource.name }}</p>
        </div>

      </div>
    </div>
    <router-link to="resource" class="home-section-more">
            <span>
            更多
            </span>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      resources: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.showArti = false
      this.$http.get(this.$api.indexAPI.homeResource).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.resources = data.content
          this.showArti = true
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/indexAPI/homeResource',
      //   method: 'get',
      //   data: {},
      //   beforeSend: () => {
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.resources = data.content
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
  .resource-wrapper {
    width: 60%;
    text-align: center;
    margin: 0 auto !important;
  }

  .resource-item {
    margin: 0 auto;
    text-align: left;
  }

  .resource-item-header.right.floated {
    color: #0c99ff;
    margin: 12px 25px 0 0 !important;
    font-size: 15px;
    font-weight: bolder;
  }

  .resource-item-header.resource-item-filename {
    color: green;
    margin: 0 0 0 10px !important;
    font-size: 15px;
    font-weight: bolder;
  }

  .resource-item-icon {
    font-size: 20px;
    border-radius: 20px;
    display: inline;
    border: 1px dashed rgba(128, 128, 128, 0.31);
    padding: 5px;
    vertical-align: middle;
  }

  .resource-item-icon i {
    margin: 0;
  }

  .resource-item-filename {
    display: inline-block;
    font-size: 18px;
    line-height: 36px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 70%;
  }
</style>
