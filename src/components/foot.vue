<template>
  <div class="foot">
    <ul class="foot-ul">
      <li><a href="http://weibo.com/5476721400/profile?topnav=1&wvr=6&is_all=1" target="_blank">意见反馈</a></li>
      <li><a v-on:click="showUpdates">更新记录</a></li>
      <li><a href="https://tongji.baidu.com/web/welcome/ico?s=e7c24de1d57b9b8afc61be4fd0efa974" target="_blank">访问统计</a>
      </li>
      <li><a v-on:click="showThanks">特别感谢</a></li>
      <li>
        <router-link to="/app/running">运动数据</router-link>
      </li>
      <li><a href="/admin.html" target="_blank">后台登录</a></li>
    </ul>
    <div class="foot-span">
      赣ICP备15011558号
    </div>
    <div class="ui basic modal thanks-modal">
      <div class="header">
        特别感谢
      </div>
      <i class="close icon"></i>
      <div class="image content">
        <div class="description">
          <p>
            <a href="https://cloud.tencent.com/" target="_blank">
              <i class="icon linkify"></i>
              腾讯云
            </a>
          </p>
          <p>
            <a href="https://tongji.baidu.com/" target="_blank">
              <i class="icon linkify"></i>
              百度统计
            </a>
          </p>
          <p>
            <a href="http://www.geetest.com/" target="_blank">
              <i class="icon linkify"></i>
              极验验证
            </a>
          </p>
          <p>
            <a href="http://changyan.kuaizhan.com/" target="_blank">
              <i class="icon linkify"></i>
              畅言
            </a>
          </p>
        </div>
      </div>
    </div>
    <div class="ui basic modal updates-modal">
      <div class="header">
        更新记录
      </div>
      <i class="close icon"></i>
      <div class="scrolling content">
        <h4>2018.08.31</h4>
        <p>网站多页面重构，更换在线编辑器</p>
        <h4>2017.09.02</h4>
        <p>增加"我的运动数据"</p>
        <h4>2017.08.18</h4>
        <p>增加favicon</p>
        <h4>2017.08.18</h4>
        <p>修复 访问不存在资源时，页面显示为空的BUG</p>

        <h4>2017.08.17</h4>
        <p>开启全站HTTPS访问</p>
        <h4>2017.08.17</h4>
        <p>百度分享本地化，修复重复进入文章后无法分享的BUG</p>
        <h4>2017.08.17</h4>
        <p>文章图片、文件采用腾讯云CDN加速</p>

        <h4>2017.08.16</h4>
        <p>开启HTTPS访问</p>

        <h4>2017.08.15</h4>
        <p>网站正式上线</p>
      </div>
    </div>
  </div>
</template>

<script>
const $ = window.$

export default {
  name: 'app-foot',
  data () {
    return {}
  },
  methods: {
    showThanks () {
      $('.thanks-modal').modal('show')
    },
    showUpdates () {
      $('.updates-modal')
        .modal({
          onShow: function () {
            $('html,body').css({'height': '100%', 'overflow': 'hidden'})
          },
          onHide: function () {
            $('html,body').css({'height': '', 'overflow': ''})
          }
        })
        .modal('show')
    }
  }
}
</script>

<style scoped>
  .foot {
    position: fixed;
    bottom: 2em;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: block;
    width: 100%;
  }

  .foot .foot-ul {
    overflow: hidden;
    display: inline-block;
  }

  .foot .foot-ul li {
    list-style: none;
    float: left;
    border-left: 1px solid #a3b5ff;
    margin-left: -5px;
    width: 8em;
    font-size: larger;
    font-weight: bold;
  }

  .foot .foot-ul li a {
    color: rgba(134, 47, 255, 0.59);
    cursor: pointer;
  }

  .foot .foot-span {
    position: absolute;
    top: 1.6em;
    width: 100%;
    text-align: center;
    color: #cccccc;
  }

  .thanks-modal p {
    width: 100%;
    border-bottom: 1px dashed white;
  }

  .thanks-modal a {
    font-size: large;
    color: white;
  }

  .scrolling.content p {
    text-indent: 2em;
  }
</style>
