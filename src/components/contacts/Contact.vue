<template>
  <div
    style="width: 326px; height: 743px;"
    class="phone_app"
  >
    <PhoneTitle
      :title="IntlString('APP_CONTACT_NEW')"
      @back="forceCancel"
    />
    <div class="content inputText">
      <div
        class="group select"
        data-type="text"
        data-model="display"
        data-maxlength="64"
      >
        <input
          id="contact-display"
          v-model="contact.display"
          v-autofocus
          type="text"
          maxlength="64"
        >
        <span class="highlight" />
        <span class="bar" />
        <label for="contact-display">{{ IntlString('APP_CONTACT_LABEL_NAME') }}</label>
      </div>

      <div
        class="group inputText"
        data-type="text"
        data-model="number"
        data-maxlength="12"
      >
        <input
          id="contact-number"
          v-model="contact.number"
          type="text"
          maxlength="12"
        >
        <span class="highlight" />
        <span class="bar" />
        <label for="contact-number">{{ IntlString('APP_CONTACT_LABEL_NUMBER') }}</label>
      </div>
      <div
        style="margin-top: 23px; width: 263px; margin-left: 23px; "
        class="group "
        data-type="button"
        data-action="save"
        @click.stop="save"
      >
        <input
          style="font-weight: 100;"
          type="button"
          class="btn btn-green"
          :value="IntlString('APP_CONTACT_SAVE')"
          @click.stop="save"
        >
      </div>
      <div
        style="margin-top: 23px; width: 263px; margin-left: 23px;"
        class="group"
        data-type="button"
        data-action="cancel"
        @click.stop="forceCancel"
      >
        <input
          style="font-weight: 100;"
          type="button"
          class="btn btn-orange"
          :value="IntlString('APP_CONTACT_CANCEL')"
          @click.stop="forceCancel"
        >
      </div>
      <div
        style="margin-top: 23px; width: 263px; margin-left: 23px;"
        class="group"
        data-type="button"
        data-action="deleteC"
        @click.stop="deleteC"
      >
        <input
          style="font-weight: 100;"
          type="button"
          class="btn btn-red"
          :value="IntlString('APP_CONTACT_DELETE')"
          @click.stop="deleteC"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PhoneTitle from './../PhoneTitle'
import Modal from '@/components/Modal/index.js'
export default {
  components: {
    PhoneTitle
  },
  data () {
    return {
      id: -1,
      currentSelect: 0,
      ignoreControls: false,
      contact: {
        display: '',
        number: '',
        id: -1
      }
    }
  },
  computed: {
    ...mapGetters(['IntlString', 'contacts', 'useMouse'])
  },
    created () {
    if (!this.useMouse) {
      this.$bus.$on('keyUpArrowDown', this.onDown)
      this.$bus.$on('keyUpArrowUp', this.onUp)
      this.$bus.$on('keyUpEnter', this.onEnter)
    } else {
      this.currentSelect = -1
    }
    this.$bus.$on('keyUpBackspace', this.cancel)
    this.id = parseInt(this.$route.params.id)
    this.contact.number = this.$route.params.number
    if (this.id !== -1) {
      const c = this.contacts.find(e => e.id === this.id)
      if (c !== undefined) {
        this.contact = {
          id: c.id,
          display: c.display,
          number: c.number
        }
      }
    }
  },
  beforeDestroy: function () {
    this.$bus.$off('keyUpArrowDown', this.onDown)
    this.$bus.$off('keyUpArrowUp', this.onUp)
    this.$bus.$off('keyUpEnter', this.onEnter)
    this.$bus.$off('keyUpBackspace', this.cancel)
  },
  methods: {
    ...mapActions(['updateContact', 'addContact']),
    onUp () {
      if (this.ignoreControls === true) return
      let select = document.querySelector('.group.select')
      if (select.previousElementSibling !== null) {
        document.querySelectorAll('.group').forEach(elem => {
          elem.classList.remove('select')
        })
        select.previousElementSibling.classList.add('select')
        let i = select.previousElementSibling.querySelector('input')
        if (i !== null) {
          i.focus()
        }
      }
    },
    onDown () {
      if (this.ignoreControls === true) return
      let select = document.querySelector('.group.select')
      if (select.nextElementSibling !== null) {
        document.querySelectorAll('.group').forEach(elem => {
          elem.classList.remove('select')
        })
        select.nextElementSibling.classList.add('select')
        let i = select.nextElementSibling.querySelector('input')
        if (i !== null) {
          i.focus()
        }
      }
    },
    onEnter () {
      if (this.ignoreControls === true) return
      let select = document.querySelector('.group.select')
      if (select.dataset.type === 'text') {
        let options = {
          limit: parseInt(select.dataset.maxlength) || 64,
          text: this.contact[select.dataset.model] || ''
        }
        this.$phoneAPI.getReponseText(options).then(data => {
          this.contact[select.dataset.model] = data.text
        })
      }
      if (select.dataset.action && this[select.dataset.action]) {
        this[select.dataset.action]()
      }
    },
    save () {
      if (this.id === -1 || this.id === 0) {
        this.addContact({
          display: this.contact.display,
          number: this.contact.number
        })
      } else {
        this.updateContact({
          id: this.id,
          display: this.contact.display,
          number: this.contact.number
        })
      }
      history.back()
    },
    cancel () {
      if (this.ignoreControls === true) return
      if (this.useMouse === true && document.activeElement.tagName !== 'BODY') return
      history.back()
    },
    forceCancel () {
      history.back()
    },
    deleteC () {
      if (this.id !== -1) {
        this.ignoreControls = true
        let choix = [{title: 'Annuler'}, {title: 'Annuler'}, {title: 'Supprimer', color: 'red'}, {title: 'Annuler'}, {title: 'Annuler'}]
        Modal.CreateModal({choix}).then(reponse => {
          this.ignoreControls = false
          if (reponse.title === 'Supprimer') {
            this.$phoneAPI.deleteContact(this.id)
            history.back()
          }
        })
      } else {
        history.back()
      }
    }
  }
}
</script>

<style scoped>
.contact{
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.title{
    padding-left: 16px;
    height: 34px;
    line-height: 34px;
    font-weight: 700;
    background-color: #5264AE;
    color: white;
}
.content{
  margin: 28px 10px 6px;
}
.group {
  position:relative;
  margin-top:24px;
}
.group.inputText {
  position:relative;
  margin-top:45px;
}
input {
  display:block;
  width:100%;
  border:none;
  border-bottom:1px solid #e9e9eb;
  font-weight: 100;
  font-size: 20px;
}
input:focus 		{ outline:none; }
/* LABEL ======================================= */
label 				 {
  color:#999;
  font-size:18px;
  font-weight:normal;
  position:absolute;
  pointer-events:none;
  left:5px;
  top:10px;
  transition:0.2s ease all;
  -moz-transition:0.2s ease all;
  -webkit-transition:0.2s ease all;
}
/* active state */
input:focus ~ label, input:valid ~ label 		{
  top:-24px;
  font-size:18px;
  color:gray;
}
/* BOTTOM BARS ================================= */
.bar 	{ position:relative; display:block; width:100%; }
.bar:before, .bar:after 	{
  content:'';
  height:3px;
  width:0;
  bottom:1px;
  position:absolute;
  transition:0.2s ease all;
  -moz-transition:0.2s ease all;
  -webkit-transition:0.2s ease all;
}
.bar:before {
  left:50%;
}
.bar:after {
  right:50%;
}
/* active state */
input:focus ~ .bar:before, input:focus ~ .bar:after,
.group.select input ~ .bar:before, .group.select input ~ .bar:after{
  width:50%;
}
/* HIGHLIGHTER ================================== */
.highlight {
  position:absolute;
  height:60%;
  width:100px;
  top:25%;
  left:0;
  pointer-events:none;
  opacity:0.5;
}
/* active state */
input:focus ~ .highlight {
  -webkit-animation:inputHighlighter 0.3s ease;
  -moz-animation:inputHighlighter 0.3s ease;
  animation:inputHighlighter 0.3s ease;
}
.group .btn{
    width: 100%;
    padding: 0px 0px;
    height: 48px;
    border: 0 none;
    font-size: 22px;
    font-weight: 500;
    line-height: 34px;
    color: #202129;
    background-color: #edeeee;
}
.group.select .btn{
    /* border: 6px solid #C0C0C0; */
    line-height: 18px;
}
.group .btn.btn-green{
  border: 1px solid #0b81ff;
  color: #0b81ff;
  background-color: white;
  font-weight: 500;
  border-radius: 28px;
}
.group.select .btn.btn-green, .group:hover .btn.btn-green{
  background-image: linear-gradient(to right, #62A3FF, #4994FF , #0b81ff);
  color: white;
  border: none;
}
.group .btn.btn-orange{
  border: 1px solid #B6B6B6;
  color: #B6B6B6;
  background-color: white;
  font-weight: 500;
  border-radius: 28px;
}
.group.select .btn.btn-orange, .group:hover .btn.btn-orange{
  background-image: linear-gradient(to right, #D3D3D3, #C5C5C5 , #B6B6B6);
  color: white;
  border: #B6B6B6;
}
.group .btn.btn-red{
  border: 1px solid #e74c3c80;
  color: #e74c3c;
  background-color: white;
  font-weight: 500;
  border-radius: 28px;
}
.group.select .btn.btn-red, .group:hover .btn.btn-red{
  background-image: linear-gradient(to right, #FF5B5B, #FF4B4B , #FE3C3C);
  color: white;
  border: none;
}
/* ANIMATIONS ================ */
@-webkit-keyframes inputHighlighter {
	from { background:#5264AE; }
  to 	{ width:0; background:transparent; }
}
@-moz-keyframes inputHighlighter {
	from { background:#5264AE; }
  to 	{ width:0; background:transparent; }
}
@keyframes inputHighlighter {
	from { background:#5264AE; }
  to 	{ width:0; background:transparent; }
}
</style>