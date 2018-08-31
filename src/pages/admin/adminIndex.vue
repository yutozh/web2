<template>
  <div class="admin">
    <nav class="admin-nav">
      <div class="ui vertical menu">
        <div class="item">
          <div class="ui input"><input type="text" placeholder="Search...">
          </div>
        </div>

        <router-link to="/">
          <span class="item">控制台首页</span>
        </router-link>
        <div class="item">
          内容管理
          <div class="menu">
            <router-link to="/manageKnowledge" class="item">知识库</router-link>
            <router-link to="/manageQuestion" class="item">问题栏</router-link>
            <router-link to="/manageResource" class="item">资源站</router-link>
            <router-link to="/manageMessage" class="item">留言版</router-link>
          </div>
        </div>
        <div class="item">
          帐号管理
          <div class="menu">
            <router-link to="/manageKnowledge" class="item">管理员用户</router-link>
          </div>
        </div>
        <div class="item">
          应用管理
          <div class="menu">
            <router-link to="/appRunning" class="item">运动数据</router-link>
          </div>
        </div>
        <div class="item">
          <router-link to="/login" class="item" @click="loginOut">退出登录</router-link>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    this.$emit('bgReady')
    if (localStorage.getItem('login') !== '1') {
      this.$router.replace({
        path: '/login',
        query: {redirect: this.$router.currentRoute.fullPath}
      })
    }
  },
  methods: {
    loginOut () {
      this.$http.post(this.$api.adminAPI.loginOut, {}).then((res) => {
        this.$router.replace({
          path: '/login',
          query: {redirect: this.$router.currentRoute.fullPath}
        })
      })
    }
  }
}
</script>

<style>
  body {
    background-color: rgba(108, 255, 154, 0.24) !important;
  }

  .admin {
    height: 100%;
  }

  .admin-nav {
    /*float: left;*/
    /*width: 15em;*/
    position: fixed;
    left: 0;
    top: 0;
    width: 15%;
    display: block !important;
    height: 100%;
    padding-bottom: 0;
    overflow: visible !important;
    margin-right: -20%;
  }

  .admin-nav .menu {
    height: 100%;
    width: 100% !important;
  }

  .admin-content-wrapper {
    float: left;
    width: 85%;
    height: 100%;
    margin-left: 15%;
    padding: 0 5%;
    padding-bottom: 5%;
    /*text-align: center;*/
  }

  .content-tilte {
    font-size: large;
    font-weight: bold;
    color: #5c60ff;
    margin-top: 50px;
    margin-bottom: 20px;
  }
</style>
