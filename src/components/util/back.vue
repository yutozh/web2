<template>
  <div class="back-container">
    <router-link :to="backroute">
      <i class="arrow circle left icon"> 返回</i>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: ['backroute']

}
</script>

<style scoped>
  .back-container {
    text-align: left;
    font-size: large;
  }

  .back-container a, .back-container i {
    color: #5cc3f6;
    transition: 0.8s ease;
  }

  .back-container i {
    width: 4em !important;
  }

  .back-container i:hover {
    color: #ff3969 !important;
    transform: translateX(-5px);
  }
</style>
