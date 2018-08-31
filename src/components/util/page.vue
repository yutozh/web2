<template>
  <div class="page">
    <div>
      <a class="page-item page-pre" v-if="pagePre"
         v-on:click="changePage(currentPage-1)"></a>
      <a class="page-item" v-bind:class="[currentPage===1 ? 'active': '' ]"
         v-on:click="changePage(1)">
        1
      </a>

      <i class="page-3point ellipsis horizontal icon" v-if="pointB"></i>

      <a class="page-item" v-for="page in pageArray" v-on:click="changePage(page)" v-bind:key="page"
         v-bind:class="[page==currentPage ? 'active': '' ]">
        {{ page }}
      </a>

      <i class="page-3point ellipsis horizontal icon" v-if="pointE"></i>

      <a class="page-item" v-bind:class="[currentPage===allPage ? 'active': '' ]"
         v-on:click="changePage(allPage)" v-if="allPage!=1">
        {{ allPage }}
      </a>

      <a class="page-item page-next" v-if="pageNext"
         v-on:click="changePage(currentPage+1)"></a>
      <span>
                当前共{{ allPage }}页， 跳至
            </span>
      <input class="page-input" maxlength="3" v-model="userPage"
             v-on:keyup.enter="changePage(userPage)"
             v-on:keyup="userPage=userPage.replace(/\D/g,'')"
             v-on:afterpaste="userPage=userPage.replace(/\D/g,'')">
      <span>页</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageSize: this.page_size,
      pageRange: this.page_range,
      userPage: ''
    }
  },
  props: {
    all_items: {
      type: Number,
      default: 1
    },
    page_size: {
      type: Number,
      default: 2
    },
    current_page: {
      type: Number,
      default: 1
    },
    page_range: {
      type: Number,
      default: 2
    }
  },
  computed: {
    currentPage: function () {
      return this.current_page
    },
    allItems: function () {
      return this.all_items
    },
    allPage: function () {
      return Math.ceil(this.allItems / this.pageSize)
    },
    pagePre: function () {
      return this.currentPage !== 1
    },
    pageNext: function () {
      return this.currentPage !== this.allPage
    },
    pageArray: function () {
      let arr = []
      let start = this.currentPage - this.pageRange
      let end = this.currentPage + this.pageRange
      for (let i = (start < 2 ? 2 : start); i <= (end > this.allPage - 1 ? this.allPage - 1 : end); i++) {
        arr.push(i)
      }
      return arr
    },
    //
    pointB: function () {
      return ((this.currentPage - this.pageRange) > 2)
    },
    //
    pointE: function () {
      return ((this.currentPage + this.pageRange) < this.allPage - 1)
    }
  },
  methods: {
    changePage: function (page) {
      page = parseInt(page)
      if (page === this.currentPage) {
        return
      }
      if (page < 1) {
        page = 1
      }
      if (page > this.allPage) {
        page = this.allPage
      }
      this.userPage = ''
      this.$emit('changePage', page)
    }
  }

}
</script>

<style scoped>
  .page {
    width: 100%;
    text-align: center;
    margin-top: 60px;
  }

  .page-item {
    display: inline-block;
    color: #4f99d4;
    background-color: rgba(155, 215, 255, 0.47);
    width: 24px;
    height: 24px;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    margin: 0 5px;
    line-height: 23px;
    padding-right: 1px;

  }

  .page-item:hover {
    background-color: #8ee5ff;
  }

  .page-item.active {
    background-color: #19e6be;;
    color: white;
  }

  .page-item.page-pre::before {
    content: '<';
    font-weight: bolder;
  }

  .page-item.page-next::before {
    content: '>';
    font-weight: bolder;
  }

  .page-3point {
    color: darkgrey;
    margin: 0 5px;
  }

  .page-input {
    width: 45px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    border-radius: 10px;
    font-size: 16px;
    border: 1px solid #6babbe;
    background-color: #c7fdff;
    outline: none;
    color: #4f99d4;
  }

  .page span {
    height: 24px;
    color: #ccc;
  }
</style>
