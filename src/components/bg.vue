<template>
  <div class="background" v-bind:class="{'is-blur':isBlur}">
    <div class="background-blur" v-bind:class="{'is-blur':isBlur}"></div>
    <div class="background-content" v-bind:class="{'is-blur':!isBlur}">
      <game></game>
    </div>
  </div>
</template>

<script>
import game from './util/game.vue'
import bgURL from '../assets/img/bg.jpg'
import bgBlurURL from '../assets/img/bg-blur.jpg'

const $ = window.$
export default {
  name: 'app-bg',
  data () {
    return {
      blur: true
    }
  },
  created () {
    this.$root.eventHub.$on('toggleBg', (para) => {
      if (this.$route.path === '/') {
        if (para === 'blur') {
          this.blur = true
        } else if (para === 'full') {
          this.blur = false
        }
      }
    })
  },
  mounted () {
    let img1 = new Image()
    img1.src = bgURL
    img1.onload = () => {
      $('.background').css('background-image', `url(${img1.src})`)
      let img2 = new Image()
      img2.src = bgBlurURL
      img2.onload = () => {
        $('.background-blur').css('background-image', `url(${img2.src})`)
        this.$emit('bgReady')
      }
    }
  },
  computed: {
    isBlur () {
      const that = this
      if (this.$route.path !== '/') {
        that.blur = true
      }
      return this.blur
    }
  },
  components: {
    game: game
  }
}
</script>

<style>
  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: no-repeat top;
    background-size: cover;
    transition: opacity 0.8s ease;
  }

  .background-blur {
    opacity: 0;
    width: 100%;
    height: 100%;
    background: no-repeat top;
    background-size: cover;
    transition: opacity 0.8s ease;
  }

  .is-blur {
    opacity: 1 !important;
  }

  .background-content {
    opacity: 0;

    width: 60%;
    height: 70%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border: 1px solid rgba(204, 204, 204, 0.05);
    transition: opacity 1.8s ease;
  }
</style>
