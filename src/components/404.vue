<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <div class="error-container">
        <p><span>错误：</span>404</p>
        <p><span>访问地址：</span>{{path}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      path: this.$route.fullPath
    }
  }
}
</script>

<style src="../assets/css/body-wrapper.css"></style>
<style scoped>
  .error-container {
    width: 60%;
    margin: 0 auto;
  }

  .error-container p span {
    font-size: medium;
    color: #0c99ff;
  }
</style>
