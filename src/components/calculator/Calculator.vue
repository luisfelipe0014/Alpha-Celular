
<template>
  <div 
    class="phone_app"
    style="display: flex;flex-direction: column;background-color: #000000; width: 325px; height: 742px; color: white" 
  >    
    <PhoneTitle 
      :title="IntlString('APP_CALCULATOR_TITLE')"
      background-color="#FF9602"
      color="white"
      @back="onBackspace"
    />
    <input
      id="screen"
      v-model="message"
      v-autofocus
      type="text"
      maxlength="64"
    >
    <div class="buttons">
      <div
        id="colorr2"
        class="button"
        @click.stop="clear"
      >
        {{ message == 0 ? 'AC' : 'C' }}
      </div>
      <div
        id="colorr2"
        class="button"
        @click.stop="inverse"
      >
        +/-
      </div>
      <div
        id="colorr2"
        class="button"
        @click.stop="percentage"
      >
        %
      </div>

      <div
        class="button"
        @click.stop="operator('/')"
      >
        /
      </div>
      <div
        class="button"
        @click.stop="input('7')"
      >
        7
      </div>
      <div
        class="button"
        @click.stop="input('8')"
      >
        8
      </div>
      <div
        class="button"
        @click.stop="input('9')"
      >
        9
      </div>
      <div
        class="button"
        @click.stop="operator('*')"
      >
        X
      </div>
      <div
        class="button"
        @click.stop="input('4')"
      >
        4
      </div>
      <div
        class="button"
        @click.stop="input('5')"
      >
        5
      </div>
      <div
        class="button"
        @click.stop="input('6')"
      >
        6
      </div>
      <div
        class="button"
        @click.stop="operator('-')"
      >
        -
      </div>
      <div
        class="button"
        @click.stop="input('1')"
      >
        1
      </div>
      <div
        class="button"
        @click.stop="input('2')"
      >
        2
      </div>
      <div
        class="button"
        @click.stop="input('3')"
      >
        3
      </div>
      <div
        class="button"
        @click.stop="operator('+')"
      >
        +
      </div>
      <div
        id="zero"
        class="button"
        @click.stop="input('0')"
      >
        0
      </div>
      <div
        class="button"
        @click.stop="input('.')"
      >
        .
      </div>
      <div
        class="button"
        @click.stop="equal()"
      >
        =
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PhoneTitle from './../PhoneTitle'
export default {
  components: {
    PhoneTitle
  },
  data () {
    return {
        value: '',
        message: '0',
        equation: '',
        cal: ''
    }
  },
  computed: {
    ...mapGetters(['IntlString', 'useMouse', 'Apps']),
    channelName() {
      return '# ' + this.channel
    }
  },
  created () {
    this.$bus.$on('keyUpBackspace', this.onBackspace)
  },
  beforeDestroy () {
    this.$bus.$off('keyUpBackspace', this.onBackspace)
  },
  methods: {
    input: function(num) {
      if(num == '.' && this.message.includes('.'))
        return;
      else if(this.message == '0'){
        this.message = num;
        this.value = num;
      }    
      else {
        this.value += num;
        this.message = this.value;
      }
    },
    clear: function() {
      if(this.message == '0')
        this.equation = '';
      this.message = '0';
      this.value = '';
    },
    operator: function(opt) {
      this.cal = opt;
      this.equation += this.value;
      this.message = eval(this.equation).toString();
      this.equation = this.message;
      this.equation += opt;
      this.value = '';
    },
    percentage: function() {
      this.equation = '';
      this.message = (this.message/100).toString();
      this.value = this.message;
    },
    inverse : function() {
      if (this.message == 0)
        return false;
      this.equation = '';
      if(this.message[0] == '-')
        this.message = this.message.substr(1);
      else
        this.message = '-' + this.message;
      this.value = this.message;
    },
    equal: function() {
      if(this.equation == '')
        return;
      if(this.cal != '')
        this.equation += this.message;
      this.message = eval(this.equation).toString();
      console.log(eval(this.equation));
      this.value = '';
      this.cal = '';
      this.equation = this.message;
    },
    onBackspace () {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped="true">
@font-face {
  font-family: "San Francisco";
  font-weight: 400;
  src: url("https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-regular-webfont.woff");
}

#screen {
    padding-top: 80px;
    font-size: 108px;
    text-align: right;
    border: none;
    color: #FFFFFF;
    background-color: #000000;
    border-radius: 0;
    font-family: "San Francisco", Helvetica, Arial, san-serif;

}

.button {
    width: 25%;
    padding: 16px 0px;
    font-size: 31px;
    font-weight: bold;
    text-align: center;
    border: #000000 5px solid;
    background: #2f2f31;
    border-radius: 50%;
    box-sizing: border-box;
    transition: box-shadow 0.3s;
    font-family: "San Francisco", Helvetica, Arial, san-serif;
}
.button:nth-child(4n),.button:last-child {
    background-color: #FF9602;
}
.button:hover {
    filter: opacity(0.8);
}
.button:active {
    box-shadow: 2px 2px 10px #666 inset;
}
#zero {
    text-align: left;
    padding-left: 26px;
    flex-grow: 2;
}

#colorr2 {
    color: #000000;
    background: #A4A4A4;
}

.buttons {
    user-select: none;
    cursor: pointer;
    font-size: 30px;
    display: flex;
    flex-wrap: wrap;
    background-color: #000000;
    margin-bottom: 30px;
    color: #fff;
}

#calculator {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #000000;
}
</style>
