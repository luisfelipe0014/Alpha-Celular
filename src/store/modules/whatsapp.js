import PhoneAPI from './../../PhoneAPI'
const LOCAL_NAME = 'groups_zap'

const state = {
  whatsapp: [],
  groups: JSON.parse(localStorage[LOCAL_NAME] || null) || [],
  currentChannel: null,
  messagesGroups: []
}

const getters = {
  whatsapp: ({whatsapp}) => whatsapp,
  groups: ({groups}) => groups,
  nbwhatsappUnread: ({whatsapp}) => {
    return whatsapp.filter(e => e.isRead !== 1).length
  }
}

const actions = {
  setMessages({commit}, whatsapp) {
    commit('SET_MESSAGES', whatsapp)
  },
  // eslint-disable-next-line no-unused-vars
  sendWhatsapp({commit}, {phoneNumber, group, message}) {
    console.log(phoneNumber, group, message)
    PhoneAPI.sendWhatsapp(phoneNumber, group, message)
  },
  // eslint-disable-next-line no-unused-vars
  deleteMessage({commit}, {id}) {
    PhoneAPI.deleteMessage(id)
  },
  deleteMessagesNumber({commit, state}, {num}) {
    PhoneAPI.deleteMessagesNumber(num)
    commit('SET_MESSAGES', state.whatsapp.filter(mess => {
      return mess.transmitter !== num
    }))
  },
  deleteAllMessages({commit}) {
    PhoneAPI.deleteAllMessages()
    commit('SET_MESSAGES', [])
  },
  setMessageRead({commit}, num) {
    PhoneAPI.setMessageRead(num)
    commit('SET_MESSAGES_READ', {num})
  },
  resetMessage({commit}) {
    commit('SET_MESSAGES', [])
  }
}

const mutations = {
  SET_MESSAGES(state, whatsapp) {
    state.whatsapp = whatsapp
  },
  ADD_MESSAGE(state, message) {
    state.whatsapp.push(message)
  },
  SET_MESSAGES_READ(state, {num}) {
    for (let i = 0; i < state.whatsapp.length; i += 1) {
      if (state.whatsapp[i].transmitter === num && state.whatsapp[i].isRead !== 1) {
        state.whatsapp[i].isRead = 1
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

if (process.env.NODE_ENV !== 'production') {
  const time = new Date().getTime()
  const numRandom = '' + Math.floor(Math.random() * 10000000)
  state.groups = [
    {id: 0, transmitter: '0000', receiver: '06', time: time - 160, message: '#666-123', isRead: 1, owner: 0},
  ]
  state.whatsapp = [
    {id: 0, transmitter: '0000', receiver: '06', time: time - 160, message: '#666-123', isRead: 1, owner: 0},
    {id: 1, transmitter: numRandom, receiver: '06', time: time - 160, message: 'Salut sa va ?!!!', isRead: 1, owner: 0},
    {id: 2, transmitter: numRandom, time, message: 'Tu fait quoi?', isRead: 1, owner: 0},
    {id: 3, transmitter: numRandom, time, message: 'Oui est toi ?', isRead: 1, owner: 1},
    {id: 4, transmitter: numRandom, time, message: 'GPS : 244 - 123', isRead: 1, owner: 0},
    {id: 2, transmitter: numRandom, time, message: 'Abcdefghijklmnopqrstuvwxyz1234567889', isRead: 1, owner: 0},
    {id: 3, transmitter: numRandom, time, message: 'Oui est toi ?', isRead: 1, owner: 1},
    {id: 4, transmitter: numRandom, time, message: 'GPS : 244 - 123', isRead: 1, owner: 0},
    {id: 2, transmitter: numRandom, time, message: 'Tu fait quoi?', isRead: 1, owner: 0},
    {id: 3, transmitter: numRandom, time, message: 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', isRead: 1, owner: 1},
    {id: 4, transmitter: numRandom, time, message: 'GPS : 244 - 123', isRead: 1, owner: 0},
    {id: 2, transmitter: numRandom, time, message: 'Abcdefghijklmnopqrstuvwxyz1234567889?????????????????????????', isRead: 1, owner: 0},
    {id: 3, transmitter: numRandom, time, message: 'Oui est toi ?', isRead: 1, owner: 1},
    {id: 4, transmitter: numRandom, time, message: 'Abcdefghijklmnopqrstuvwxyz1234567889', isRead: 1, owner: 0},
    {id: 2, transmitter: numRandom, time, message: 'Tu fait quoi?', isRead: 0, owner: 0},
    {id: 3, transmitter: numRandom, time, message: 'Oui est toi ?', isRead: 0, owner: 1},
    {id: 4, transmitter: numRandom, time, message: 'GPS : 244 - 123', isRead: 1, owner: 0},
    {id: 2, transmitter: numRandom, time, message: 'Tu fait quoi?', isRead: 1, owner: 0},
    {id: 3, transmitter: numRandom, time, message: 'Oui est toi ?', isRead: 1, owner: 1},
    {id: 4, transmitter: numRandom, time, message: 'GPS : 244 - 123', isRead: 1, owner: 0},
    {id: 2, transmitter: numRandom, time, message: 'Tu fait quoi?', isRead: 0, owner: 0},
    {id: 3, transmitter: numRandom, time, message: 'Oui est toi ?', isRead: 1, owner: 1},
    {id: 4, transmitter: numRandom, time, message: 'GPS: 244.21, -123.15', isRead: 1, owner: 0},
    {id: 5, transmitter: 'Policia', time, message: 'Tu fait quoi?', isRead: 0, owner: 1},
    {id: 6, transmitter: 'Ambulancia', time, message: 'Sim estou aqui ?', isRead: 1, owner: 1},
    {id: 7, transmitter: 'John doe', time, message: 'https://i.imgur.com/gthahbs.png', isRead: 0, owner: 0},
    {id: 8, transmitter: 'Apenas um Teste', time, message: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', isRead: 0, owner: 1},
    {id: 9, transmitter: '01', time, message: 'GPS: -1034.5810546875, -2734.1027832031', isRead: 0, owner: 0},
    {id: 10, transmitter: 'Zonzo', time, message: 'Salut sa va ?', isRead: 0, owner: 0}
  ]
}
