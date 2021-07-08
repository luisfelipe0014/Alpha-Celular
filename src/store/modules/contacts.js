import PhoneAPI from './../../PhoneAPI'

const state = {
  contacts: [],
  defaultContacts: []
}

const getters = {
  contacts: ({contacts, defaultContacts}) => [...contacts, ...defaultContacts]
}

const actions = {
  updateContact(context, {id, display, number, icon}) {
    PhoneAPI.updateContact(id, display, number, icon)
  },
  addContact(context, {display, number, icon}) {
    PhoneAPI.addContact(display, number, icon)
  },
  deleteContact(context, {id}) {
    PhoneAPI.deleteContact(id)
  },
  resetContact({commit}) {
    commit('SET_CONTACTS', [])
  }
}

const mutations = {
  SET_CONTACTS(state, contacts) {
    state.contacts = contacts.sort((a, b) => a.display.localeCompare(b.display))
  },
  SET_DEFAULT_CONTACTS(state, contacts) {
    state.defaultContacts = contacts
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  state.contacts = [
    {
      id: 2,
      number: '336-4557',
      icon: 'https://media.discordapp.net/attachments/653616138902569000/819597673283321886/logo.png?width=840&height=473',
      display: 'John doe'
    },
    {
      id: 4,
      number: '336-4553',
      display: 'Nop user'
    }
  ]
}
