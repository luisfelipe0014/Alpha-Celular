import PhoneAPI from './../../PhoneAPI'
const LOCAL_NAME = 'groups_zap'
import {Howl} from 'howler'

let TchatAudio = null

const state = {
  channels: JSON.parse(localStorage[LOCAL_NAME] || null) || [],
  currentChannel: null,
  messagesChannel: []
}

const getters = {
  tchatChannels: ({ channels }) => channels,
  tchatCurrentChannel: ({ currentChannel }) => currentChannel,
  tchatMessages: ({ messagesChannel }) => messagesChannel
}

const actions = {
  tchatReset ({commit}) {
    commit('TCHAT_SET_MESSAGES', { messages: [] })
    commit('TCHAT_SET_CHANNEL', { channel: null })
    commit('TCHAT_REMOVES_ALL_CHANNELS')
  },
  tchatSetChannel ({ state, commit, dispatch }, { channel }) {
    if (state.currentChannel !== channel) {
      commit('TCHAT_SET_MESSAGES', { messages: [] })
      commit('TCHAT_SET_CHANNEL', { channel })
      dispatch('tchatGetMessagesChannel', { channel })
    }
  },
  tchatSetMessage ({commit}, messagesChannel) {
    commit('TCHAT_SET_MESSAGES', messagesChannel)
  },
  tchatAddMessage ({ state, commit, getters }, { message }) {
    const channel = message.channel
    if (state.channels.find(e => e.channel === channel) !== undefined) {
      if (TchatAudio !== null) {
        TchatAudio.pause()
        TchatAudio = null
      }
      TchatAudio = new Howl({
        src: '/html/static/sound/tchatNotification.ogg',
        volume: getters.volume
      })
      TchatAudio.play()
    }
    commit('TCHAT_ADD_MESSAGES', { message })
  },
  tchatAddChannel ({ commit }, { channel,icon }) {
    commit('TCHAT_ADD_CHANNELS', { channel,icon })
  },
  tchatRemoveChannel ({ commit }, { channel }) {
    commit('TCHAT_REMOVES_CHANNELS', { channel })
  },
  // eslint-disable-next-line no-unused-vars
  tchatGetMessagesChannel ({ commit }, { channel }) {
    PhoneAPI.tchatGetMessagesChannel(channel)
  },
  tchatSendMessage (state, { channel, message }) {
    PhoneAPI.tchatSendMessage(channel, message)
  }
}

const mutations = {
  TCHAT_SET_CHANNEL (state, { channel }) {
    state.currentChannel = channel
  },
  TCHAT_ADD_CHANNELS (state, { channel,icon }) {
    state.channels.push({
      channel,
      icon
    })
    localStorage[LOCAL_NAME] = JSON.stringify(state.channels)
  },
  TCHAT_REMOVES_CHANNELS (state, { channel }) {
    state.channels = state.channels.filter(c => {
      return c.channel !== channel
    })
    localStorage[LOCAL_NAME] = JSON.stringify(state.channels)
  },
  TCHAT_REMOVES_ALL_CHANNELS (state) {
    state.channels = []
    localStorage[LOCAL_NAME] = JSON.stringify(state.channels)
  },
  TCHAT_ADD_MESSAGES (state, { message }) {
    if (message.channel === state.currentChannel) {
      state.messagesChannel.push(message)
    }
  },
  TCHAT_SET_MESSAGES (state, { messages }) {
    state.messagesChannel = messages
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

if (process.env.NODE_ENV !== 'production') {
  state.currentChannel = 'alphastore'
  state.messagesChannel = JSON.parse('[{"channel":"alphastore","receive":"alphastore","message":"Boa Noite a Todos","id":1,"owner":1,"time":1528671680000},{"channel":"alphastore","receive":"alphastore","message":"Hop outro teste","id":2,"owner":1,"time":1528671153000}]')
  state.messagesChannel.push({
    channel: 'alphastore',
    receive:'alphastore',
    message: 'A ta tudo certo sim kkkkkkkkkk',
    id: 3, 
    owner: 1,
    time: new Date().getTime()
  })
  state.messagesChannel.push({
    channel: 'alphastore',
    receive:'alphastore',
    message: 'Eae Beleza!',
    id: 4, 
    owner: 1,
    time: new Date(4567845).getTime()
  })
  for (let i = 0; i < 3; i++) {
    state.messagesChannel.push(Object.assign({}, state.messagesChannel[0], { channel: 'alphastore', receive:'alphastore', id: 5 + i, owner: 1, message: 'mess ' + i, time: new Date().getTime() }))
  }
}
