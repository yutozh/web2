<template>
  <div class="header-wrapper">
    <div class="header-main">
      <ul class="clear">
        <li v-for="(item, index) in headerItems" v-bind:class="active(item.hrefUrl)" v-bind:key="index">
          <router-link :to="item.hrefUrl" v-on:mouseover="item.hover=true" v-on:mouseout="item.hover=false">
            <span>{{ item.text }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <!--左右的叶子-->
    <!--<div class="header-animate-wrapper">-->
    <!--<div class="header-animate">-->
    <!--<div class="header-animate-left" ></div>-->
    <!--<div class="header-animate-right" v-bind:class="{hide:hideSide}"></div>-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
export default {
  name: 'app-nav',
  data () {
    return {
      hideSide: true,
      headerItems: [
        {text: '知识库', hrefUrl: '/knowledge'},
        {text: '问题栏', hrefUrl: '/question'},
        {text: '首页', hrefUrl: '/'},
        {text: '资源站', hrefUrl: '/resource'},
        {text: '留言板', hrefUrl: '/message'}
      ]
    }
  },
  created () {

  },
  methods: {
    active (url) {
      if (this.$route.path === url) {
        return {active: true}
      }
      return {active: false}
    }
  },
  computed: {}
}
</script>

<style scoped>
  .header-wrapper {
    height: 100px;
    padding-top: 5px;
    background-size: 1px;
  }

  .header-main {
    position: relative;
    z-index: 1000;
    margin: 0 auto;
    margin-top: -15px;
    padding-left: 6px;
    height: 93px;
    padding-top: 20px;
    background-image: linear-gradient(rgba(60, 60, 60, 0.21), rgba(255, 255, 255, 0));
  }

  .header-main ul {
    list-style: none;
    width: 1000px;
    margin: 0 auto;
    display: block;
  }

  .header-main ul li {
    float: left;
    width: 200px;
    height: 50px;
    line-height: 50px;
    color: white;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
    font-size: 20px;
  }

  .header-main ul li:hover, .header-main ul li.active {
    background: url(data:image/png;base64,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UmVhZHlxyWU8AAADJmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU1NzcyLCAyMDE0LzAxLzEzLTE5OjQ0OjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEIyMkQ4QjE0NTA3MTFFNzlCQ0JDMEIxRkRCQ0JFNTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEIyMkQ4QjI0NTA3MTFFNzlCQ0JDMEIxRkRCQ0JFNTIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QjIyRDhBRjQ1MDcxMUU3OUJDQkMwQjFGREJDQkU1MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QjIyRDhCMDQ1MDcxMUU3OUJDQkMwQjFGREJDQkU1MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pp94NQ0AABTbSURBVHja7F3t0fS2DSQ1V1FciLtJanA3cSEuKUJ+vZnL+UQsFgvq4yFnPOP3OYkiKXK1C4BgN7OGlN/+9WdbZZVk6W//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) top no-repeat;
    background-size: 130px;
  }

  .header-main ul li.active {
    color: aqua;
  }

  .header-main ul li a {
    display: inline-block;
    color: inherit;
    width: 100%;
    height: 100%;
    outline: none;
  }

  .header-main ul li span {
    position: relative;
    font-size: 1em;
  }

  .header-main ul li span:before {
    content: "";
    background: url("../assets/img/title-point-left.png");
    top: 0.25em;
    left: -17px;
    width: 10px !important;
    display: inline-block;
    height: 10px;
    position: absolute;
    background-size: 100%;
  }

  .header-main ul li span:after {
    content: "";
    background: url("../assets/img/title-point-right.png");
    top: 0.25em;
    right: -15px;
    width: 10px !important;
    display: inline-block;
    height: 10px;
    position: absolute;
    background-size: 100%;
  }

  .header-animate-wrapper {
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 999;
  }

  .header-animate {
    height: 140px;
  }

  .header-animate-left {
    position: absolute;
    background: url("../assets/img/left-leaf.png") no-repeat;
    left: -10px;
    top: 55px;
    width: 331px;
    height: 200px;
    background-size: cover;
    opacity: 1;
    transition: 0.5s ease;
  }

  .header-animate-left.hide {
    opacity: 0;
    transform: translateX(-200px);
  }

  .header-animate-right {
    position: absolute;
    background: url("../assets/img/right-leaf.png") no-repeat;
    right: -10px;
    top: 55px;
    width: 331px;
    height: 200px;
    background-size: cover;
    opacity: 1;
    transition: 0.5s ease;
  }

  .header-animate-right.hide {
    opacity: 0;
    transform: translateX(200px);
  }

  .clear::after {
    clear: both;
    content: "";
    display: block;
    width: 0;
    height: 0;
  }
</style>
