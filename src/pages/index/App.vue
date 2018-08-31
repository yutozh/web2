<template>
  <div id="app">
    <div id="loading-bar"></div>
    <div class="alert" v-bind:class="alertClass"
         v-if="alertShow">
      <span>{{alertMsg}}</span>
    </div>
    <app-bg @bgReady="hideWrapper"></app-bg>
    <app-nav></app-nav>
    <router-view></router-view>
    <app-foot></app-foot>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import foot from '@/components/foot.vue'
import bg from '@/components/bg.vue'

export default {
  name: 'app',
  components: {
    appFoot: foot,
    appNav: navbar,
    appBg: bg
  },
  data () {
    return {
      alertShow: false,
      alertMsg: '',
      alertType: 0
    }
  },
  methods: {
    hideWrapper () {
      let obj = document.getElementById('loading-bar')
      if (obj !== null) {
        obj.style.display = 'none'
      }
    }
  },
  created () {
    this.$root.eventHub.$on('showAlert', (msg, type) => {
      if (type === undefined) type = 0
      this.alertMsg = msg
      this.alertShow = true
      this.alertType = type
      setTimeout(() => {
        this.alertShow = false
      }, 1800)
    });
    // 百度统计
    (function () {
      let hm = document.createElement('script')
      hm.src = 'https://hm.baidu.com/hm.js?e7c24de1d57b9b8afc61be4fd0efa974'
      let s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    })()
  },
  mounted () {

  },
  computed: {
    alertClass () {
      return this.alertType === 0 ? 'warn' : 'success'
    }
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: none;
    -webkit-tap-highlight-color: transparent;
  }

  a {
    text-decoration: none;
  }

  ::selection {
    background: rgba(66, 69, 255, 0.22);
    /*color: #86b1ff;*/
  }

  #app {
    font-family: Microsoft Yahei, Tahoma, Helvetica, Arial, \\5B8B\4F53, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .body-container {
    padding-top: 50px;
  }

  /*没有内容时的提示样式*/
  .emptyPrompt {
    font-size: medium;
    color: cornflowerblue;
    font-weight: bolder;
  }

  .alert span {
    line-height: 2.5em;
  }

  .alert {
    position: fixed;
    left: 0;
    right: 0;
    top: 10px;
    margin: 0 auto;
    width: 20%;
    height: 2.5em;
    text-align: center;
    font-size: medium;
    z-index: 2147483647;
    border-radius: 0.5em;
    animation: showAlert 0.3s;
  }

  .alert.success {
    background-color: #fcfff5;
    color: #316431;
    border: 1px solid #a3c293;
  }

  .alert.warn {
    background-color: rgba(255, 124, 193, 0.75);
    color: white;
    border: 1px solid hotpink;
  }

  @keyframes showAlert {
    from {
      transform: translateY(-100px);
    }
    to {
      transform: translateY(0);
    }
  }
</style>

<style>
  #loading-bar {
    position: fixed;
    z-index: 10000;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  #loading-bar:before {
    content: "加载中";
    top: 50%;
    left: 50%;
    margin: -9px 0 0 -20.5px;
    color: darkorchid;
    position: absolute;
  }

  #loading-bar:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -32px 0 0 -32px;
    width: 64px;
    height: 64px;
    background: url("data:image/gif;base64,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") no-repeat;
  }
</style>
