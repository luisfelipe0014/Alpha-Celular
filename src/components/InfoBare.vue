<template>
  <div
    style="width: 326px; top: 3px;"
    :style="{
      backgroundColor: backgroundColor,
      color: color
    }"
    class="phone_infoBare barre-header"
  >
    <!-- <span class="reseau">{{ config.reseau }}</span>-->
    <span class="time">
      <current-time style="font-size: 13px; margin-right: 2px;font-family: 'SF Pro Text Regular';font-weight: bolder;" />
    </span>
    <div 
      class="rigth" 
      style="float: right;font-size: 12px;"
    >
      <FontAwesomeIcon
        :icon="['fas', 'signal']"
      />
      <FontAwesomeIcon
        :icon="['fas', 'wifi']"
      />
      <FontAwesomeIcon
        :icon="['fas', 'battery-three-quarters']"
      />
    </div>
    <!-- <div class="signal">
      <hr class="barre1">
      <hr class="barre2">
      <hr class="barre3">
      <hr class="barre4 nosignal">
    </div> -->
  </div>
</template>
<script>
import CurrentTime from './CurrentTime'

export default {
  components: {
    CurrentTime
  },
  props: {
    title: {
      type: String,
      required: true
    },
    showInfoBare: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: null,
    },
    backgroundColor: {
      type: String,
      default: null,
    }
  },
  computed: {
    style() {
      return {
        backgroundColor: this.backgroundColor || '#000',
        color: this.color || '#000'
      }
    }
  }
}
</script>
<style scoped>

.barre-header {
  height: 24px;
  font-size: 17px;
  line-height: 24px;
  padding: 1px 20px 0 24px;
  width: 100%;
  color: #000;
  background-color: rgba(0, 0, 0, 0.2);
  font-weight: 900;
  position: relative;
}

.barre-header hr {
  position: absolute;
  display: inline-block;
}

.reseau {
  font-size: 12px;
}


.nosignal {
  background-color: rgba(255, 255, 255, 0.6) !important;
  color: #000 !important;
}

.barre1 {
  height: 3px;
  width: 3px;
  right: 12.5%;
  background-color: #000;
  border: none;
  bottom: -3px;
}

.barre2 {
  height: 6px;
  width: 3px;
  right: 11.5%;
  background-color: #000;
  border: none;
  bottom: -3px;
}

.barre3 {
  height: 9px;
  width: 3px;
  right: 10%;
  background-color: #000;
  border: none;
  bottom: -3px;
}
.barre4 {
  height: 12px;
  width: 3px;
  right: 9%;
  background-color: #000;
  border: none;
  bottom: -3px;
}

.time {
  text-align: right;
  /* float: left; */
  margin-right: -14px;
  font-size: 12px;
  padding-right: 12px;
  font-family: 'SF Pro Text Regular';
  position: relative;
  right: -4px;
}

.playerID {
  text-align: center;
  float: left;
  margin: auto;
  width: 88%;
  font-size: 12px;
  padding-right: 12px;
}
</style>
