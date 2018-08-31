<template>
  <div class="share-component">
    <div class="share-prompt">
      分享到:
    </div>
    <div class="bdsharebuttonbox" data-tag="share_1">
      <i class="circular star icon"><a class="bds_qzone" data-cmd="qzone"></a></i>
      <i class="circular weibo icon"><a class="bds_tsina" data-cmd="tsina"></a></i>
      <i class="circular qq icon"><a class="bds_tqq" data-cmd="tqq"></a></i>
      <i class="circular wechat icon"><a class="bds_weixin" data-cmd="weixin"></a></i>
      <i class="circular facebook icon"><a class="bds_fbook" data-cmd="fbook"></a></i>
    </div>
    <div class="right-prompt">
      作者保留权利
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {

  },
  mounted () {
    setTimeout(function () {
      window._bd_share_main = undefined
      window._bd_share_is_recently_loaded = undefined
      let doc = document
      let s = doc.createElement('script')
      let h = doc.getElementsByTagName('head')[0] || doc.head || doc.documentElement
      s.type = 'text/javascript'
      s.charset = 'utf-8'
      s.src = '/bdShare/static/api/js/share.js'
      h.insertBefore(s, h.firstChild)
      window._bd_share_config = {
        common: {
          bdText: '我分享了一篇文章，快来看看吧～',
          bdUrl: 'oattao.cn'
        },
        share: [{
          'bdSize': 24,
          'bdCustomStyle': '/bdShare/static/api/css/empty.css'
        }]
      }
    }, 1000)
  }
}
</script>

<style scoped>
  .share-component {
    width: 100%;
    text-align: left;
    height: 80px;
  }

  .share-prompt {
    display: inline-block;
    font-size: medium;
    font-weight: bold;
  }

  .right-prompt {
    display: inline-block;
    float: right;
    line-height: 40px;
    color: #bbb;
    margin-right: 5px;
  }

  .bdsharebuttonbox {
    display: inline-block;
  }

  .bdsharebuttonbox i {
    position: relative;
    cursor: pointer;
    font-size: large;
  }

  .bdsharebuttonbox i a {
    display: inline-block;
    position: absolute;
    height: 28px;
    width: 28px;
    top: 4px;
    left: 4px;
  }

  i:hover {
    color: #5cc3f6
  }

  i:hover.facebook {
    color: #3b5998
  }

  i:hover.qq {
    color: #59adeb
  }

  i:hover.wechat {
    color: #0C3
  }

  i:hover.weibo {
    color: #d72928
  }

  i:hover.star {
    color: #f0e750
  }
</style>
