<template>
  <div class="tools">
    <div class="search-bar">
      <input v-bind:placeholder="placeholder" v-model="searchStr"
             v-on:focus="focus=true" v-on:blur="focus=false"
             v-on:keyup.enter="search" v-bind:class="{active:focus}"/>
      <i class="search icon" v-if="searchStr.length === 0"
         v-on:click="search"></i>
      <i class="remove icon" v-else v-on:click="searchStr = ''"></i>
    </div>
  </div>

</template>

<script>
export default {
  props: ['placeholder'],
  data () {
    return {
      searchStr: '',
      focus: false
    }
  },
  methods: {
    search () {
      if (this.searchStr === '') {
        return 1
      } else {
        this.$emit('requestSearch', this.searchStr)
        return 1
      }
    }
  }
}
</script>

<style scoped>
  .tools {
    margin: 0 auto;
    width: 60%;
  }

  .search-bar {
    text-align: left;
    width: 300px;
    position: relative;
  }

  .search-bar input {
    height: 35px;
    width: 300px;
    border: 1px solid #84e1d7;
    border-radius: 15px;
    color: #1ea882;
    background-color: #f3fffe;
    outline: none;
    padding: 8px 35px 8px 12px;
  }

  .search-bar input::placeholder {
    color: #1ea882;
  }

  .search-bar input.active {
    box-shadow: 0 0 16px #ccc;
  }

  .search-bar i {
    position: absolute;
    font-size: 14px;
    right: 11px;
    bottom: 13.5px;
    color: #1ea882;
  }

  .search-bar .remove.icon {
    cursor: pointer;
  }
</style>
