<template>
  <div
    style="width: 326px; height: 743px;"
    class="screen"
  >
    <PhoneTitle
      :title="'Whatsapp'"
      style="backgroundColor: #fff; color: black"
      @back="back"
    />
    <div 
      class="subheard"
    >
      <div
        class="add-contato adds"
        @click.stop="onSelectContact()"
      >  
        Adicionar contato
      </div>
      <div
        class="add-grupo adds"
      >  
        Novo grupo
      </div>
    </div>
    <div
      style="width: 324px; height: 635px;"
      class="phone_content elements"
    >
      <div
        v-for="(elem, key) in messagesData"
        :key="elem[keyDispay]"
        class="element"
        :class="{ select: key === currentSelect}"
        @click.stop="onSelect(elem)"
        @contextmenu.prevent.stop="onOption(elem)"
      >
        <div
          class="elem-pic"
          :style="stylePuce(elem)"
          @click.stop="onSelect(elem)"
        />
        <div
          v-if="elem.puce !== undefined && elem.puce !== 0"
          class="elem-puce"
          @click.stop="onSelect(elem)"
          @contextmenu.prevent.stop="onOption(elem)"
        >
          {{ elem.puce }}
        </div>
        <div
          v-if="elem.keyDesc === undefined || elem.keyDesc === ''"
          class="elem-title"
          @click.stop="onSelect(elem)"
          @contextmenu.prevent.stop="onOption(elem)"
        >
          {{ elem[keyDispay] }}
        </div>
        <div
          v-if="elem.keyDesc !== undefined && elem.keyDesc !== ''"
          class="elem-title-has-desc"
          @click.stop="onSelect(elem)"
          @contextmenu.prevent.stop="onOption(elem)"
        >
          {{ elem[keyDispay] }}
        </div>
        <div
          v-if="elem.keyDesc !== undefined && elem.keyDesc !== ''"
          class="elem-description"
          @click.stop="onSelect(elem)"
          @contextmenu.prevent.stop="onOption(elem)"
        >
          {{ elem.keyDesc }}
        </div>
        <div
          v-if="elem.lastMessage !== undefined && elem.lastMessage !== ''"
          class="elem-timeLast-message"
          @click.stop="onSelect(elem)"
          @contextmenu.prevent.stop="onOption(elem)"
        >
          {{ formatTime(elem.lastMessage) }}
        </div>
      </div>
    </div>
    <div 
      class="subfooter"
    >
      <div
        class="add-contato adds"
        @click.stop="onSelectContact()"
      >  
        Adicionar Contato
      </div>
      <div
        class="add-grupo adds"
      >  
        Novo Grupo
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { generateColorForStr } from '@/Utils'
import Modal from '@/components/Modal/index.js'
import PhoneTitle from './../PhoneTitle'

export default {
  components: {
    PhoneTitle
  },
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showInfoBare: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#FFFFFF'
    },
    backgroundColor: {
      type: String,
      default: '#4CAF50'
    },
    keyDispay: {
      type: String,
      default: 'display'
    },
    disable: {
      type: Boolean,
      default: false
    },
    titleBackgroundColor: {
      type: String,
      default: '#FFFFFF'
    }
  },
  data () {
    return {
      disableList: false,
      currentSelect: 0
    }
  },
  computed: {
    ...mapGetters(['IntlString', 'useMouse', 'contacts', 'whatsapp', 'tchatChannels', 'tchatMessages']),
    messagesData: function () {
      let messages = this.whatsapp
      let contacts = this.contacts
      let groups = this.tchatChannels
      let messagesgroups = this.tchatMessages
      let messGroup2 = groups.reduce((rv, x) => {
        if (rv[x['channel']] === undefined) {
          const data = {
            noRead: 0,
            lastMessage: 0,
            time: new Date().getTime(),
            icon: x.icon,
            letter: undefined,
            number: x.channel,
            puce: undefined,
            unknowContact: true,
            display: x.channel
          }
          this.setChannel(x.channel)
          let groupMessage = messagesgroups.find(e => e.channel === x.channel)
          if (groupMessage) {
              if (groupMessage.channel === x.channel) {
                data.lastMessage = groupMessage.time
                data.keyDesc = groupMessage.message
              }
          } else {
            data.lastMessage = 0
            data.keyDesc = " "
          }
          rv[x['channel']] = data
        }
        return rv
      }, {})
      let messGroup = messages.reduce((rv, x) => {
        if (rv[x['transmitter']] === undefined) {
          const data = {
            noRead: 0,
            lastMessage: 0,
            icon: x.icon,
            display: x.transmitter
          }
          let contact = contacts.find(e => e.number === x.transmitter)
          data.unknowContact = contact === undefined
          if (contact !== undefined) {
            data.display = contact.display
            data.backgroundColor = contact.backgroundColor || generateColorForStr(x.transmitter)
            data.letter = contact.letter
            data.icon = contact.icon
          } else {
            data.backgroundColor = generateColorForStr(x.transmitter)
          }
          rv[x['transmitter']] = data
        }
        if (x.isRead === 0) {
          rv[x['transmitter']].noRead += 1
        }
        if (x.time >= rv[x['transmitter']].lastMessage) {
          rv[x['transmitter']].lastMessage = x.time
          rv[x['transmitter']].keyDesc = x.message
        }
        return rv
      }, {})
      let mess2 = []
      Object.keys(messGroup2).forEach(key => {
        mess2.push({
          display: messGroup2[key].display,
          icon: messGroup2[key].icon,
          lastMessage: messGroup2[key].lastMessage,
          keyDesc: messGroup2[key].keyDesc,
          puce: messGroup2[key].noRead,
          number: key
        })
      })
      mess2.sort((a, b) => b.lastMessage - a.lastMessage)
      let mess = []
      Object.keys(messGroup).forEach(key => {
        mess.push({
          display: messGroup[key].display,
          puce: messGroup[key].noRead,
          number: key,
          lastMessage: messGroup[key].lastMessage,
          keyDesc: messGroup[key].keyDesc,
          backgroundColor: messGroup[key].backgroundColor,
          icon: messGroup[key].icon,
          letter: messGroup[key].letter,
          unknowContact: messGroup[key].unknowContact
        })
      })
      mess.sort((a, b) => b.lastMessage - a.lastMessage)
      mess2.sort((a, b) => b.lastMessage - a.lastMessage)
      return [...mess,...mess2]
    },
    newMessageOption () {
      return {
        backgroundColor: '#C0C0C0',
        display: this.IntlString('APP_MESSAGE_NEW_MESSAGE'),
        letter: '+',
        id: -1
      }
    }
  },
  created: function () {
    if (!this.useMouse) {
      this.$bus.$on('keyUpArrowDown', this.onDown)
      this.$bus.$on('keyUpArrowUp', this.onUp)
      this.$bus.$on('keyUpArrowRight', this.onRight)
      this.$bus.$on('keyUpEnter', this.onEnter)
    } else {
      this.currentSelect = -1
    }
    this.tchatSetMessage
  },
  beforeDestroy: function () {
    this.$bus.$off('keyUpArrowDown', this.onDown)
    this.$bus.$off('keyUpArrowUp', this.onUp)
    this.$bus.$off('keyUpArrowRight', this.onRight)
    this.$bus.$off('keyUpEnter', this.onEnter)
  },
  methods: {
    ...mapActions(['deleteMessagesNumber', 'deleteAllMessages', 'startCall', 'tchatSetChannel', 'tchatSendMessage']),
    setChannel(channel) {
      this.channel = channel
      this.tchatSetChannel({channel})
    },
    stylePuce(data) {
      data = data || {}
      if (data.icon !== undefined) {
        return {
          backgroundImage: `url(${data.icon})`,
          backgroundSize: 'cover' || 'cover', /* ou 120px Caso a Imagem buga */
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          color: 'rgba(0,0,0,0)',
          borderRadius: '50%'
        }
      }
      return {
        backgroundImage: 'url("/html/static/img/icons_app/perfilsemfoto.png")',
        backgroundSize: 'contain', /* ou 120px Caso a Imagem buga */
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        borderRadius: '50%'
      }
    },
    onSelectContact: function () {
      this.$router.push({name: 'whatsapp.selectcontact'})
    },
    onSelect: function (data) {
      if (data.id === -1) {
        this.$router.push({name: 'whatsapp.selectcontact'})
      } else {
        this.$router.push({name: 'whatsapp.view', params: data})
      }
    },
    onOption: function (data) {
      if (data.number === undefined) return
      this.disableList = true
      Modal.CreateModal({
        choix: [
          {id: 4, title: this.IntlString('APP_PHONE_CALL'), icons: 'phone'},
          {id: 5, title: this.IntlString('APP_PHONE_CALL_ANONYMOUS'), icons: 'mask'},
          {id: 6, title: this.IntlString('APP_MESSAGE_NEW_MESSAGE'), icons: 'sms'},
          {id: 1, title: this.IntlString('APP_MESSAGE_ERASE_CONVERSATION'), icons: 'trash', color: 'orange'},
          /* {id: 2, title: this.IntlString('APP_MESSAGE_ERASE_ALL_CONVERSATIONS'), icons: 'trash', color: 'red'},
          {id: 3, title: this.IntlString('CANCEL'), icons: 'undo'} */
           {id: 2, title: this.IntlString('APP_MESSAGE_ERASE_ALL_CONVERSATIONS'), icons: 'trash', color: 'red'}
        ]
        .concat(data.unknowContact ? [{id: 7, title: this.IntlString('APP_MESSAGE_SAVE_CONTACT'), icons: 'save'}] : [])
        .concat([{id: 3, title: this.IntlString('CANCEL'), icons: 'undo'}])
      }).then(rep => {
        if (rep.id === 1) {
          this.deleteMessagesNumber({num: data.number})
        } else if (rep.id === 2) {
          this.deleteAllMessages()
        } else if (rep.id === 4) {
          this.startCall({ numero: data.number })
        } else if (rep.id === 5) {
          this.startCall({ numero: '#' + data.number })
        } else if (rep.id === 6) {
          this.$router.push({name: 'whatsapp.view', params: data})
        } else if (rep.id === 7) {
          this.$router.push({name: 'contacts.view', params: {id: 0, number: data.number}})
        }
        this.disableList = false
      })
    },
    scrollIntoViewIfNeeded: function () {
      this.$nextTick(() => {
        document.querySelector('.select').scrollIntoViewIfNeeded()
      })
    },
    onUp: function () {
      if (this.disable === true) return
      this.scrollIntoViewIfNeeded()
    },
    onDown: function () {
      if (this.disable === true) return
      this.scrollIntoViewIfNeeded()
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
    back: function () {
      if (this.disableList === true) return
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
.screen{
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.subheard {
  display: flex;
  justify-content: space-between;
  padding: 0.6vw 1vw;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
}

.adds {
  color: #0070c9;
  font-size: 14px;
  cursor: pointer;
}

.list {
  height: 100%;
}

.elements {
  overflow-y: auto;
}

.element {
  height: 58px;
  line-height: 58px;
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 300;
  font-size: 18px;
  cursor: pointer;
  transition: all 1s ease-out;
}

.element::after{
  content: '';
  position: absolute;
  left: 77px;
  height: 58px;
  width: 76%;
  display: flex;
  align-items: center;
  border-top: 1px solid #e8e8e8;
}

.element:first-child::after {
  border-top: none!important;
}

.element.select, .element:hover {
  background-color: #ebebeb;
}

.elem-pic {
  margin-left: 12px;
  height: 48px;
  width: 48px;
  text-align: center;
  line-height: 48px;
  font-weight: 200;
}

.elem-puce {
  vertical-align: middle;
  line-height: 50px;
  box-shadow: 2px 2px 5px #999;
  background-color: #0070c9;
  top: 24px;
  color: white;
  height: 17px;
  width: 17px;
  border-radius: 50%;
  text-align: center;
  font-size: 13px;
  font-weight: normal;
  position: absolute;
  right: 9px;
  z-index: 6;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.elem-title {
  margin-left: 12px;
  font-size: 20px;
  font-weight: 400;
}

.elem-title-has-desc {
  margin-top: -30px;
  margin-left: 12px;
  font-family: Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif;
  /* font-style: italic; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  font-weight: 600;
  color: #000;
  font-size: 16px;
}

.elem-timeLast-message {
  text-align: left;
  color: rgb(0 0 0 / 60%);
  position: absolute;
  display: block;
  right: 8px;
  top: -13px;
  font-family: Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  font-weight: 600;
}

.elem-description {
  text-align: left;
  color: rgb(0 0 0 / 60%);
  position: absolute;
  display: block;
  width: 65%;
  left: 73px;
  top: 3px;
  font-family: Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  font-weight: 600;
}
</style>
