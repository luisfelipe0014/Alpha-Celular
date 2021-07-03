<template>
  <div
    style="width: 326px; height: 743px;"
    class="home"
    :style="{background: 'url(' + backgroundURL +')'}"
    :class="{
      'deblur' : doDeblur,
    }"
  >
    <InfoBare />
    <span
      v-if="notification"
      class="notificationMess"
    >
      <div
        class="notificationMess_icon"
        :style="{ color : notificationInfo.color }"
      >
        <FontAwesomeIcon :icon="[notificationInfo.prefix, notificationInfo.icon]" />
      </div>
      <span class="notificationMess_content">
        <span
          class="notificationMess_title"
          style="font-weight:bold"
        >
          {{ notificationInfo.app }}
        </span>
        <br>
        <span
          v-if="notificationInfo.message"
          class="notificationMess_mess"
        >
          {{ notificationInfo.message.substring(0,30) }}...
        </span>
      </span>
    </span>

    <span
      v-if="messages.length >= warningMessageCount"
      class="warningMess"
    >
      <div class="warningMess_icon">
        <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" />
      </div>
      <span class="warningMess_content">
        <span class="warningMess_title">{{ IntlString('PHONE_WARNING_MESSAGE') }}</span><br>
        <span class="warningMess_mess">{{ messages.length }} / {{
          warningMessageCount
        }} {{ IntlString('PHONE_WARNING_MESSAGE_MESS') }}</span>
      </span>
    </span>

    <div class="time" />
    <div class="time-display">
      {{ timeDisplay }}
    </div>
    <div
      class="menu"
      @click="onBack"
    >
      <div class="menu_content">
        <div class="menu_buttons">
          <button
            v-for="(but, key) of Apps"
            :key="but.name"
            class="letra"

            :class="{ select: key === currentSelect}"
            :style="{backgroundImage: 'url(' + but.icons +')'}"
            @click.stop="openApp(but)"
          >
            {{ but.intlName }}
            <span
              v-if="but.puce !== undefined && but.puce !== 0"
              class="puce"
            >{{ but.puce }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="home_buttons">
      <button
        v-for="(but) of AppsHome"
        :key="but.name"
        style="font-family:initial;"
        :style="{backgroundImage: 'url(' + but.icons +')'}"

        @click="openApp(but)"
      >
        <!--{{but.intlName}}-->
        <span
          v-if="but.puce !== undefined && but.puce !== 0"
          class="puce"
        >{{ but.puce }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import InfoBare from './InfoBare'

export default {
  components: {
    InfoBare
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.prevRoute = from
    })
  },
  data() {
    return {
      timeDisplay: null,
      currentSelect: 0,
      nBotonesMenu: 4,
      prevRoute: '/',
      doDeblur: false,
    }
  },
  computed: {
    ...mapGetters(['notification', 'notificationInfo', 'IntlString', 'useMouse', 'nbMessagesUnread', 'backgroundURL', 'messages', 'Apps', 'AppsHome', 'warningMessageCount'])
  },
  created() {
    if (!this.useMouse) {
      this.$bus.$on('keyUpArrowLeft', this.onLeft)
      this.$bus.$on('keyUpArrowRight', this.onRight)
      this.$bus.$on('keyUpArrowDown', this.onDown)
      this.$bus.$on('keyUpArrowUp', this.onUp)
      this.$bus.$on('keyUpEnter', this.onEnter)
    } else {
      this.currentSelect = -1
    }
    this.$bus.$on('keyUpBackspace', this.onBack)
  },
  beforeDestroy() {
    this.$bus.$off('keyUpArrowLeft', this.onLeft)
    this.$bus.$off('keyUpArrowRight', this.onRight)
    this.$bus.$off('keyUpArrowDown', this.onDown)
    this.$bus.$off('keyUpArrowUp', this.onUp)
    this.$bus.$off('keyUpEnter', this.onEnter)
    this.$bus.$off('keyUpBackspace', this.onBack)
  },
  methods: {
    ...mapActions(['closePhone', 'setMessages']),
    onLeft: function () {
      const l = Math.floor(this.currentSelect / this.nBotonesMenu)
      const newS = (this.currentSelect + this.nBotonesMenu - 1) % this.nBotonesMenu + l * this.nBotonesMenu
      this.currentSelect = Math.min(newS, this.Apps.length - 1)
    },
    onRight: function () {
      const l = Math.floor(this.currentSelect / this.nBotonesMenu)
      let newS = (this.currentSelect + 1) % this.nBotonesMenu + l * this.nBotonesMenu
      if (newS >= this.Apps.length) {
        newS = l * this.nBotonesMenu
      }
      this.currentSelect = newS
    },
    onUp: function () {
      let newS = this.currentSelect - this.nBotonesMenu
      if (newS < 0) {
        const r = this.currentSelect % this.nBotonesMenu
        newS = Math.floor((this.Apps.length - 1) / this.nBotonesMenu) * this.nBotonesMenu
        this.currentSelect = Math.min(newS + r, this.Apps.length - 1)
      } else {
        this.currentSelect = newS
      }
    },
    onDown: function () {
      const r = this.currentSelect % this.nBotonesMenu
      let newS = this.currentSelect + this.nBotonesMenu
      if (newS >= this.Apps.length) {
        newS = r
      }
      this.currentSelect = newS
    },
    openApp(app) {
      this.$router.push({name: app.routeName})
    },
    onEnter() {
      this.openApp(this.Apps[this.currentSelect])
    },
    onBack() {
      this.closePhone()
    },
    resetNotifications (timer) {
      new Promise((resolve) => {
        setTimeout(() => {
          if (this.notification.active) {
            this.notification.active = false
            this.notification.app = null
            this.notification.icon.icon = null
            this.notification.icon.color = null
            this.notification.message = null
          }
          resolve();
        },timer)
      })
    }
  },
}
</script>

<style scoped="true">
.blur {
  filter: blur(6px);
}
.home {
  background-size: cover !important;
  background-position: center !important;

  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* display: flex; */
  align-content: center;
  justify-content: center;
  color: gray;
}

.warningMess {
  background-color: white;
  position: absolute;
  left: 12px;
  right: 12px;
  top: 34px;
  min-height: 64px;
  display: flex;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
}

.warningMess .warningMess_icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  height: 42px;
  width: 42px;
  border-radius: 50%;
}

.warningMess .warningMess_icon {
  text-align: center;
  color: #F94B42;
}

.warningMess .warningMess_content {
  padding-left: 12px;
  background-color: rgba(255, 255, 255, 0.2);
}

.warningMess_title {
  font-size: 20px;
}

.warningMess_mess {
  font-size: 16px;
}

.notificationMess {
  background-color: white;
  position: absolute;
  left: 12px;
  right: 12px;
  top: 34px;
  min-height: 64px;
  display: flex;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
  z-index: 999999999;
}

.notificationMess .notificationMess_icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  width: 42px;
  border-radius: 50%;
}

.notificationMess .notificationMess_icon {
  text-align: center;
}

.notificationMess .wnotificationMess_content {
  padding-left: 12px;
  background-color: rgba(255, 255, 255, 0.2);
}

.notificationMess_title {
  font-size: 20px;
}

.notificationMess_mess {
  font-size: 16px;
}

.menu {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 6px 8px;
}

.backblur {
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  position: absolute;
  background-size: cover !important;
  background-position: center !important;
  -webkit-animation: blur 500ms;
  filter: blur(6px);

}

.menu_content {
  display: flex;
  flex-direction: column;
}

.menu_buttons {
  margin-top: 24px;
  display: flex;
  width: 100%;
  /* margin-left: 10px; */
  align-items: flex-start;
  align-content: flex-start;
  flex-flow: row;
  flex-wrap: wrap;
  margin-bottom: 0;
  transition: all 0.5s ease-in-out;
}

/* .menu_buttons {
  animation-name: up;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
} */

@keyframes blur {
  0% { filter: blur(0px);}
  50% { filter: blur(3px);}
  100% { filter: blur(6px);}
}

@keyframes up {
  from {
    transform: translate3d(0, 100vh, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}


.home_buttons {
  display: flex;
  padding: 0px;
  /* width: 100%; */
  bottom: 6px;
  left: 11px;
  position: absolute;
  align-items: flex-end;
  flex-flow: row;
  flex-wrap: wrap;
  margin-bottom: 3px;
  justify-content: space-between;
  transition: all 0.5s ease-in-out;
  background: rgba(0,0,0,0.2);
  border-radius: 1vw;
}

button {
  position: relative;
  border: none;
  width: 70px;
  height: 70px;
  margin: 3.6px;
  margin-bottom: 25px;
  color: white;
  background-size: 65px 65px;
  background-position: 2.61px;
  background-repeat: no-repeat;
  background-color: transparent;
  font-size: 14px;
  padding-top: 70px;
  text-align: center;
  display: flex;
  justify-content: center;
}

button .puce {
  position: absolute;
  display: block;
  background-color: #EE3838;
  font-size: 14px;
  width: 26px;
  height: 26px;
  top: -5px;
  left: 51px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  bottom: 32px;
  right: 12px;
}

button.select, button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.letra {
  font-weight: 400;
}

.home_buttons button {
  position: relative;
  margin: 0;
  border: none;
  width: 76px;
  height: 76px;
  color: white;
  background-size: 64px 64px;
  background-position: center 6px;
  background-repeat: no-repeat;
  background-color: transparent;
  font-size: 14px;
  padding-top: 72px;
  font-weight: 700;
  text-shadow: -1px 0 0 rgba(0, 0, 0, 0.8),
  1px 0 0 rgba(0, 0, 0, 0.8),
  0 -1px 0 rgba(0, 0, 0, 0.8),
  0 1px 0 rgba(0, 0, 0, 0.8);
  text-align: center;
}


.home_buttons button .puce {
  position: absolute;
  display: block;
  background-color: #EE3838;
  font-size: 14px;
  width: 26px;
  height: 26px;
  top: -5px;
  left: 51px;
  font-family: serif;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  bottom: 32px;
  right: 12px;
}

.home_buttons button.select, .home_buttons button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 22%;
}

.btn_menu_ctn {
  width: 100%;
  display: flex;
  height: 70px;
  justify-content: center;
  align-content: center;
  border-radius: 24px;
}

.btn_menu {
  height: 50px;
}

.deblur {
  position: absolute;
  background-size: cover !important;
  background-position: center !important;
  -webkit-animation: deblur 200ms ease;
}

@keyframes deblur {
  0% {
    -webkit-filter: blur(6px);
  }
  50% {
    -webkit-filter: blur(3px);
  }
  100% {
    -webkit-filter: blur(0px);
  }
}


</style>
