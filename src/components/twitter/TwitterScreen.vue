<template>
  <div
    style="width: 326px; height: 743px;"
    class="phone_app"
  >
    <PhoneTitle
      :title="currentScreen.title"
      background-color="white"
      @back="quit"
    />
    <div class="phone_content">
      <component :is="currentScreen.component" />
    </div>
    <div class="twitter_menu">
      <div
        v-for="(s, i) in screen"
        :key="i"
        class="twitter_menu-item"
        :class="{select: i === currentScreenIndex}"
        @click.stop="openMenu(i)"
      >
        <FontAwesomeIcon
          :icon="['fas', s.icon]"
          @click.stop="openMenu(i)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PhoneTitle from './../PhoneTitle'
import TwitterView from './TwitterView'
import TwitterPostTweet from './TwitterPostTweet'
import TwitterAccount from './TwitterAccount'
import TwitterTopTweet from './TwitterTopTweet'
import {mapGetters} from 'vuex'

export default {
  components: {
    PhoneTitle
  },
  data() {
    return {
      currentScreenIndex: 0
    }
  },
  computed: {
    ...mapGetters(['IntlString', 'useMouse']),
    screen() {
      return [
        {
          title: this.IntlString('APP_TWITTER_VIEW_TWITTER'),
          component: TwitterView,
          icon: 'home'
        },
        {
          title: this.IntlString('APP_TWITTER_VIEW_TOP_TWEETS'),
          component: TwitterTopTweet,
          icon: 'heart'
        },
        {
          title: this.IntlString('APP_TWITTER_VIEW_TWEETER'),
          component: TwitterPostTweet,
          icon: 'comment'
        },
        {
          title: this.IntlString('APP_TWITTER_VIEW_SETTING'),
          component: TwitterAccount,
          icon: 'cog'
        }
      ]
    },
    currentScreen() {
      return this.screen[this.currentScreenIndex]
    }
  },
  watch: {},
  created() {
    if (!this.useMouse) {
      this.$bus.$on('keyUpArrowLeft', this.onLeft)
      this.$bus.$on('keyUpArrowRight', this.onRight)
    }
    this.$bus.$on('twitterHome', this.home)
  },
  mounted() {
  },
  beforeDestroy() {
    this.$bus.$off('keyUpArrowLeft', this.onLeft)
    this.$bus.$off('keyUpArrowRight', this.onRight)
    this.$bus.$off('twitterHome', this.home)
  },
  methods: {
    onLeft() {
      this.currentScreenIndex = Math.max(0, this.currentScreenIndex - 1)
    },
    onRight() {
      this.currentScreenIndex = Math.min(this.screen.length - 1, this.currentScreenIndex + 1)
    },
    home() {
      this.currentScreenIndex = 0
    },
    openMenu(index) {
      this.currentScreenIndex = index
    },
    quit() {
      if (this.currentScreenIndex === 0) {
        this.$router.push({name: 'home'})
      } else {
        this.currentScreenIndex = 0
      }
    }
  }
}
</script>

<style scoped>
.twitter_menu {
  border-top: 1px solid #CCC;
  height: 56px;
  display: flex;
  width: 100%;
}

.twitter_menu-item {
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #959595;
}

.twitter_menu-item.select {
  color: #1da1f2;
}

.twitter_menu-item:hover {
  color: #1da1f2;
}
</style>
