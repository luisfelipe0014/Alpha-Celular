<template>
  <div
    style="width: 330px; height: 743px; backgroundColor: #f0f0f0"
    class="phone_app messages"
  >
    <PhoneTitle
      :title="displayContact"
      style="backgroundColor: #F1F1F1; color: black"
      @back="quit"
    /> <!--:title="displayContact" :backgroundColor="color" -->
    <div
      v-if="imgZoom !== undefined"
      class="img-fullscreen"
      @click.stop="imgZoom = undefined"
    >
      <img :src="imgZoom">
    </div>

    <textarea
      ref="copyTextarea"
      class="copyTextarea"
    />
    <div
      id="sms_list"
      style="width: 326px; height: 678px; backgroundColor: #e5ddd5;"
      @contextmenu.prevent.stop="showOptions"
    >
      <div
        v-for="(mess, key) in messagesList"
        :key="mess.id+key"
        class="sms"
        :class="{ select: key === selectMessage}"
        @click.stop="onActionMessage(mess)"
        @contextmenu.prevent.stop="showOptions"
      >
        <div class="sms_message_time">
          <h6
            :class="{ sms_me : compartNumber(mess) === 1}"
            class="name_other_sms_me"
          >
            {{ displayContact }}
          </h6>
        </div>
        <span
          class="sms_message sms_me"
          :class="{ sms_other : compartNumber(mess) === 0}"
          @click.stop="onActionMessage(mess)"
        >

          <img
            v-if="isSMSImage(mess)"
            class="sms-img"
            :src="mess.message"
            alt=""
            @click.stop="onActionMessage(mess)"
          >
          <span
            v-else
            @click.stop="onActionMessage(mess)"
          >{{ mess.message }}</span>
          <h6
            :class="{ sms_me : compartNumber(mess) === 1}"
            class="name_other_sms_other"
            @click.stop="onActionMessage(mess)"
          >
            {{ formatTime(mess.time) }}
          </h6>
          <!--<span style="color: white; font-size: 17px; margin: 24px;" @click.stop="onActionMessage(mess)" ><timeago class="sms_time" :since='mess.time' :auto-update="20"></timeago></span>-->
        </span>
      </div>
    </div>
    <div
      class="sms_options"
    >
      <div
        id="sms_write"
        style="width: 245px;"
        @contextmenu.prevent="showOptions"
      >
        <label>
          <input
            v-model="message"
            v-autofocus
            type="text"
            :placeholder="IntlString('APP_MESSAGE_PLACEHOLDER_ENTER_MESSAGE')"
            @keyup.enter.prevent="send"
          >
        </label>
      </div>
      <div class="options_text">
        <div
          style="    font-size: 10px;"
          class="sms_send"
          @click.stop="send"
        >
          <svg
            class="svg-send" 
            height="24"
            viewBox="0 0 24 24"
            width="24"
            @click.stop="send"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            <path
              d="M0 0h24v24H0z"
              fill="none"
            />
          </svg>
          <svg 
            class="svg-cam" 
            viewBox="0 0 512 512"
            @click.stop="takephotoo"
          >
            <path 
              d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z"
              @click.stop="takephotoo"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {generateColorForStr, getBestFontColor} from '../../Utils'
import PhoneTitle from './../PhoneTitle'
import Modal from '@/components/Modal/index.js'

var Isgroup = false

export default {
  components: {
    PhoneTitle
  },
  data() {
    return {
      ignoreControls: false,
      selectMessage: -1,
      display: '',
      phoneNumber: '',
      imgZoom: undefined,
      message: ''
    }

  },
  computed: {
    ...mapGetters(['IntlString', 'whatsapp', 'tchatMessages', 'tchatChannels', 'myPhoneNumber', 'contacts', 'useMouse', 'enableTakePhoto']),
    messagesList() {
      const c2 = this.tchatChannels.filter(c => c.channel === this.phoneNumber).sort((a, b) => a.time - b.time)
      const c = this.tchatMessages.filter(c => c.channel === this.phoneNumber).sort((a, b) => a.time - b.time)
      console.log(this.phoneNumber)
      console.log(c2)
      if (c.length !== 0) {
        console.log("passou por aqui")
        Isgroup = true
        return c
      }
      console.log("passou por aqui no false")
      Isgroup = false
      return this.whatsapp.filter(e => e.transmitter === this.phoneNumber).sort((a, b) => a.time - b.time)
    },
    displayContact() {
      if (this.display !== undefined) {
        return this.display
      }
      const c = this.contacts.find(c => c.number === this.phoneNumber)
      if (c !== undefined) {
        
        return c.display
      }
      return this.phoneNumber
    },
    color() {
      return generateColorForStr(this.phoneNumber)
    },
    colorSmsOwner() {
      return [
        {
          backgroundColor: this.color,
          color: getBestFontColor(this.color)
        }, {}
      ]
    }
  },
  watch: {
    messagesList() {
      this.setMessageRead(this.phoneNumber)
      this.resetScroll()
    }
  },
  created() {
    this.display = this.$route.params.display
    this.phoneNumber = this.$route.params.number
    if (!this.useMouse) {
      this.$bus.$on('keyUpArrowDown', this.onDown)
      this.$bus.$on('keyUpArrowUp', this.onUp)
      this.$bus.$on('keyUpEnter', this.onEnter)
      this.$bus.$on('keyUpArrowRight', this.onRight)
    }
    this.$bus.$on('keyUpBackspace', this.onBackspace)
  },
  beforeDestroy() {
    this.$bus.$off('keyUpArrowDown', this.onDown)
    this.$bus.$off('keyUpArrowUp', this.onUp)
    this.$bus.$off('keyUpEnter', this.onEnter)
    this.$bus.$off('keyUpArrowRight', this.onRight)
    this.$bus.$off('keyUpBackspace', this.onBackspace)
  },
  methods: {
    ...mapActions(['setMessageRead', 'sendWhatsapp', 'deleteMessage', 'startCall', 'tchatSetChannel', 'tchatSendMessage']),
    setChannel(channel) {
      this.channel = channel
      this.tchatSetChannel({channel})
    },
    resetScroll() {
      this.$nextTick(() => {
        let elem = document.querySelector('#sms_list')
        elem.scrollTop = elem.scrollHeight
        this.selectMessage = -1
      })
    },
    scrollIntoViewIfNeeded() {
      this.$nextTick(() => {
        const elem = this.$el.querySelector('.select')
        if (elem !== null) {
          elem.scrollIntoViewIfNeeded()
        }
      })
    },
    quit() {
      // this.$router.push({path: '/messages'})
      this.$router.go(-1)
    },
    onUp: function () {
      if (this.ignoreControls === true) return
      if (this.selectMessage === -1) {
        this.selectMessage = this.messagesList.length - 1
      } else {
        this.selectMessage = this.selectMessage === 0 ? 0 : this.selectMessage - 1
      }
      this.scrollIntoViewIfNeeded()
    },
    onDown() {
      if (this.ignoreControls === true) return
      if (this.selectMessage === -1) {
        this.selectMessage = this.messagesList.length - 1
      } else {
        this.selectMessage = this.selectMessage === this.messagesList.length - 1 ? this.selectMessage : this.selectMessage + 1
      }
      this.scrollIntoViewIfNeeded()
    },
    onEnter() {
      if (this.ignoreControls === true) return
      if (this.selectMessage !== -1) {
        this.onActionMessage(this.messagesList[this.selectMessage])
      } else {
        this.$phoneAPI.getReponseText().then(data => {
          let message = data.text.trim()
          if (message !== '') {
            this.sendWhatsapp({
              phoneNumber: this.phoneNumber,
              group: Isgroup,
              message
            })
          }
        })
      }
    },
    send() {
      const message = this.message.trim()
      if (message === '') return
      this.message = ''
      this.sendWhatsapp({
        phoneNumber: this.phoneNumber,
        group: Isgroup,
        message
      })
    },
    takephotoo() {
      const {url} = this.$phoneAPI.takePhoto()
      if (url !== null && url !== undefined) {
        this.sendWhatsapp({
          phoneNumber: this.phoneNumber,
          group: Isgroup,
          message: url
        })
      }
    },
    compartNumber(mess) {
      if (mess.transmitter === this.myPhoneNumber) return 1
      return 0
    },
    isSMSImage(mess) {
      return /^https?:\/\/.*\.(png|jpg|jpeg|gif)/.test(mess.message)
    },
    async onActionMessage(message) {
      try {
        // let message = this.messagesList[this.selectMessage]
        let isGPS = /(-?\d+(\.\d+)?), (-?\d+(\.\d+)?)/.test(message.message)
        let hasNumber = /#([0-9]+)/.test(message.message)
        let isSMSImage = this.isSMSImage(message)
        let choix = [{
          id: 'delete',
          title: this.IntlString('APP_MESSAGE_DELETE'),
          icons: 'trash'
        }, {
          id: -1,
          title: this.IntlString('CANCEL'),
          icons: 'undo'
        }]
        if (isGPS === true) {
          choix = [{
            id: 'gps',
            title: this.IntlString('APP_MESSAGE_SET_GPS'),
            icons: 'location-arrow'
          }, ...choix]
        }
        if (hasNumber === true) {
          const num = message.message.match(/#([0-9-]*)/)[1]
          choix = [{
            id: 'num',
            title: `${this.IntlString('APP_MESSAGE_MESS_NUMBER')} ${num}`,
            number: num,
            icons: 'phone'
          }, ...choix]
        }
        if (isSMSImage === true) {
          choix = [{
            id: 'zoom',
            title: this.IntlString('APP_MESSAGE_ZOOM_IMG'),
            icons: 'search'
          }, ...choix]
        }
        this.ignoreControls = true
        const data = await Modal.CreateModal({choix})
        if (data.id === 'delete') {
          this.deleteMessage({id: message.id})
        } else if (data.id === 'gps') {
          let val = message.message.match(/(-?\d+(\.\d+)?), (-?\d+(\.\d+)?)/)
          await this.$phoneAPI.setGPS(val[1], val[3])
        } else if (data.id === 'num') {
          this.$nextTick(() => {
            this.onSelectPhoneNumber(data.number)
          })
        } else if (data.id === 'zoom') {
          this.imgZoom = message.message
        }

      } finally {
        this.ignoreControls = false
        this.selectMessage = -1
      }
    },
    async onSelectPhoneNumber(number) {
      try {
        this.ignoreControls = true
        let choix = [
          {
            id: 'sms',
            title: this.IntlString('APP_MESSAGE_MESS_SMS'),
            icons: 'comment'
          },
          {
            id: 'call',
            title: this.IntlString('APP_MESSAGE_MESS_CALL'),
            icons: 'phone'
          }
        ]
        // if (this.useMouse === true) {
        choix.push({
          id: 'copy',
          title: this.IntlString('APP_MESSAGE_MESS_COPY'),
          icons: 'copy'
        })
        // }
        choix.push({
          id: -1,
          title: this.IntlString('CANCEL'),
          icons: 'undo'
        })
        const data = await Modal.CreateModal({choix})
        if (data.id === 'sms') {
          this.phoneNumber = number
          this.display = undefined
        } else if (data.id === 'call') {
          this.startCall({numero: number})
        } else if (data.id === 'copy') {
          try {
            const $copyTextarea = this.$refs.copyTextarea
            $copyTextarea.value = number
            $copyTextarea.style.height = '20px'
            $copyTextarea.focus()
            $copyTextarea.select()
            await document.execCommand('copy')
            $copyTextarea.style.height = '0'
          } catch (e) {
            await this.$phoneAPI.log(e)
          }
        }

      } finally {
        this.ignoreControls = false
        this.selectMessage = -1
      }
    },
    onBackspace() {
      if (this.imgZoom !== undefined) {
        this.imgZoom = undefined
        return
      }
      if (this.ignoreControls === true) return
      if (this.useMouse === true && document.activeElement.tagName !== 'BODY') return
      if (this.selectMessage !== -1) {
        this.selectMessage = -1
      // } else {
      //   this.quit()
      }
    },
    async showOptions() {
      try {
        this.ignoreControls = true
        let choix = [
          {id: 1, title: this.IntlString('APP_MESSAGE_SEND_GPS'), icons: 'location-arrow'},
          {id: -1, title: this.IntlString('CANCEL'), icons: 'undo'}
        ]
        if (this.enableTakePhoto) {
          choix = [
            {id: 1, title: this.IntlString('APP_MESSAGE_SEND_GPS'), icons: 'location-arrow'},
            {id: 2, title: this.IntlString('APP_MESSAGE_SEND_PHOTO'), icons: 'camera'},
            {id: -1, title: this.IntlString('CANCEL'), icons: 'undo'}
          ]
        }
        const data = await Modal.CreateModal({choix})
        if (data.id === 1) {
          this.sendWhatsapp({
            phoneNumber: this.phoneNumber,
            group: Isgroup,
            message: '%pos%'
          })
        }
        if (data.id === 2) {
          const {url} = await this.$phoneAPI.takePhoto()
          if (url !== null && url !== undefined) {
            this.sendWhatsapp({
              phoneNumber: this.phoneNumber,
              group: Isgroup,
              message: url
            })
          }
        }
        this.ignoreControls = false

      } finally {
        this.ignoreControls = false
      }
    },
    formatTime(time) {
      if (time === 0) return
      const time2 = new Date(time);
      let minutes = time2.getMinutes();
      minutes = minutes > 9 ? minutes : '0' + minutes
      let heure = time2.getHours();
      heure = heure > 9 ? heure : '0' + heure
      let fulltime = heure + ':' + minutes
      return fulltime
    },
    onRight: function () {
      if (this.ignoreControls === true) return
      if (this.selectMessage === -1) {
        this.showOptions()
      }
    }

  }
}
</script>

<style scoped>
.messages {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 326px;
  right: 0;
  height: calc(100% - 20px);
  background-color: #DDD;
}

#sms_contact {
  background-color: #4CAF50;
  color: white;
  height: 34px;
  line-height: 34px;
  padding-left: 5px;
}

#sms_list {
  height: calc(100% - 34px - 26px);
  overflow-y: auto;
  padding-bottom: 8px;
}

#sms_list:before {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 614px;
  background: url(/static/img/whatsapp/back-zap.png);
  background-repeat: no-repeat;
  opacity: 0.06;
}

.name_other_sms_other {
  position: relative;
  z-index: 10;
  float: right;
  margin: 21px 0 -5px 4px;
  vertical-align: top;
  display: inline-block;
  height: 15px;
  font-size: 11px;
  line-height: 15px;
  color: #00000073;
  white-space: nowrap;
}

.name_other_sms_me {
  display: none;
}

.name_other_sms_other.sms_me {
  display: none;

}

.sms {
  overflow: auto;
  zoom: 1;
  position: sticky; /*Caso bug de posição remova isso*/
}

.sms-img {
  width: 100%;
  height: auto;
  border-radius: 19px;
  margin-top: 2%;
}

.img-fullscreen {
  position: fixed;
  z-index: 999999;
  background-color: rgba(20, 20, 20, 0.8);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-fullscreen img {
  display: flex;
  max-width: 90vw;
  max-height: 95vh;
}

.sms_me {
  float: right;
  background-color: #dcf8c6;
  border-radius: 17px;
  padding: 6px 7px 8px 9px;
  line-height: 1;
  max-width: 85%;
  margin-right: 5%;
  margin-top: 10px;
}

.sms_other {
  background-color: #fff;
  box-shadow: 0 1px .5px rgba(0,0,0,.13);
  border-radius: 7.5px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #303030;
  float: left;
  padding: 6px 7px 8px 9px;
  line-height: 1;
  max-width: 85%;
  margin-left: 5%;
  margin-top: 10px;
}


.sms_time {
  display: block;
  font-size: 12px;
}

.sms_me .sms_time {
  color: #AAA;
  margin-left: 4px;
  margin-top: -5px;
  display: none;
  font-size: 9px;

}

.sms_other .sms_time {
  color: white;
  display: none;
  margin-left: 4px;
  margin-top: -5px;
  font-size: 9px;
}


.messages {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

/* .sms.select .sms_message, .sms_message:hover {
  background-color: #373B3C !important;

  color: #E4E3E2 !important;
}

.sms.select .sms_message, .sms_message:hover {
  background-color: #373B3C !important;
  color: white !important;
} */

.sms_message {
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif;
  font-size: 24px;
}

.sms_options {
  display: flex;
  height: 55px;
}

.options_text {
  display: flex;
  align-items: center;
  margin-left: -5px;
}

#sms_write {
  height: 30px;
  margin: 10px;
  width: 245px;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 21px;
}

#sms_write input {
  height: 30px;
  border: none;
  outline: none;
  font-size: 16px;
  margin-left: 14px;
  padding: 12px 5px;
  color: #4a4a4a;
  background-color: rgba(236, 236, 241, 0)
}

.sms_send {
  float: right;
  cursor: pointer;
  /* margin-right: 10px; */
}

.sms_send svg {
  margin: 2px;
  width: 22px;
  height: 22px;
}

.sms_send .svg-send {
  margin: 2px;
  fill: #C0C0C0;
  background: #0070c9;
  border-radius: 50%;
  padding: 4px;
}
.sms_send .svg-cam {
  cursor: pointer;
  fill: #0070c9 !important;
}

.copyTextarea {
  height: 0;
  border: 0;
  padding: 0;
}
</style>
