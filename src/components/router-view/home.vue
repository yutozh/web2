<template>
  <div>
    <div class="main-wrapper">

    </div>
    <div class="body-wrapper body-transition" v-bind:style="bodyWrapperMargin">
      <div class="body-container">
        <home-knowledge></home-knowledge>
        <home-question></home-question>
        <home-resource></home-resource>
      </div>
    </div>
  </div>
</template>

<script>
import homeKnowledge from './home/homeKnowledge.vue'
import homeQuestion from './home/homeQuestion.vue'
import homeResource from './home/homeResource.vue'

const $ = window.$

export default {
  data () {
    return {
      marginHeight: 0,
      sticky: true, // 判断scroll是否要滑动
      lastSticky: true
    }
  },
  components: {
    homeKnowledge: homeKnowledge,
    homeQuestion: homeQuestion,
    homeResource: homeResource
  },
  computed: {
    bodyWrapperMargin () {
      let height = this.marginHeight
      return {
        transform: `translateY(${height}px)`
      }
    }
  },
  created () {
    // 向父组件发出事件，父组件控制背景
    this.$root.eventHub.$emit('toggleBg', 'full')
    $(window).bind('mousewheel DOMMouseScroll', this.scrollChange)
  },
  methods: {

    scrollChange (e) {
      let delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
        (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)) // firefox
      // 判断scroll状态(delta为-1 向下,为1 向上)
      // 是否从顶部开始下滑
      if (this.sticky && delta === -1) {
        $(window).scrollTop(0)
        e.preventDefault()
        this.lastSticky = this.sticky
        this.sticky = false
      }
      // 是否在顶部上滑
      if (!this.sticky && delta === 1 && $(window).scrollTop() === 0) {
        this.lastSticky = this.sticky
        this.sticky = true
      }

      if (this.sticky !== this.lastSticky) {
        this.lastSticky = this.sticky
        // 控制margin,决定是否显示
        if (!this.sticky) {
          this.marginHeight = 0
          this.$root.eventHub.$emit('toggleBg', 'blur')
        } else {
          this.marginHeight = $(window).height()
          this.$root.eventHub.$emit('toggleBg', 'full')
        }
      }
    }
  },
  // 首次进入主页，正文隐藏，其他页面进入主页，直接显示内容
  beforeRouteEnter (to, from, next) {
    let height = 0
    if (from.path === '/') {
      height = $(window).height()
    }
    next(vm => {
      vm.marginHeight = height
      vm.lastSticky = false
    })
  }
}
</script>

<style src="../../assets/css/body-wrapper.css"></style>

<style>
  .home-section-title {
    background: url("../../assets/img/section-title.png") -3px -6px no-repeat;
    background-size: cover;
    text-align: center;
    margin: 0 auto;
    width: 258px;
    height: 97px;
    margin-top: 10px;
  }

  .home-section-title span {
    line-height: 105px;
    display: block;
    font-size: 20px;
    font-weight: bolder;
    color: #1da194;
  }

  .home-section-body {
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }

  .home-section-more {
    display: block;
    position: relative;
    text-align: center;
    background: url("../../assets/img/read-more.png") no-repeat;
    background-size: cover;
    width: 128px;
    height: 50px;
    margin: 0 auto;
    transition: all 0.8s;
    text-shadow: 0 0 2px #ccc;
    margin-top: 20px;
  }

  .home-section-more:hover {
    text-shadow: 0 0 30px deepskyblue;
  }

  .home-section-more span {
    position: absolute;
    bottom: 10px;
    font-size: 25px;
    left: 40px;
    color: deepskyblue;
  }

  .home-section-split {
    background: url("../../assets/img/split-line.png") repeat-x;
    width: 80%;
    height: 20px;
    margin: 30px auto 10px;
  }
</style>
