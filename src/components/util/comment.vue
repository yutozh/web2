<template>
  <div id="SOHUCS" v-bind:sid="sid"></div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    // iframe
    (function () {
      let appid = 'cyt87AQ8t'
      let conf = 'prod_40e9754b1788290018700c1378fdeec2'
      let doc = document
      let s = doc.createElement('script')
      let h = doc.getElementsByTagName('head')[0] || doc.head || doc.documentElement
      s.type = 'text/javascript'
      s.charset = 'utf-8'
      s.src = ' https://assets.changyan.sohu.com/upload/changyan.js?conf=' + conf + '&appid=' + appid
      h.insertBefore(s, h.firstChild)
    })()
  },
  destroyed () {
  },
  props: ['sid']
}

</script>

<style>

</style>
