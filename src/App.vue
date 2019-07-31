<template>
  <div id="app">
    <div class="nes-container with-title is-centered">
      <h1 class="title">{{ title }}</h1>
      <i class="nes-ash"></i>
      <div class="num">
        <span>{{ minutes }}</span>
        <span>:</span>
        <span>{{ seconds }}</span>
      </div>
      <div class="btns">
        <button class="nes-btn" v-if="timer" @click="stopTimer">Pause</button>
        <button class="nes-btn is-primary" v-else @click="startTimer">PLAY</button>
        <button class="nes-btn is-error" v-if="resetButton" @click="resetTimer">R</button>
        <button class="nes-btn is-success" @click="toggleFullScreen">F</button>
      </div>
    </div>

    <dialog class="nes-dialog is-rounded" id="dialog-rounded">
      <form method="dialog">
        <p class="title">Alert</p>
        <p>Return to your seat.</p>
        <menu class="dialog-menu">
          <button class="nes-btn is-primary">Confirm</button>
        </menu>
      </form>
    </dialog>
  </div>
</template>

<script>
const setTime = 15;

export default {
  name: 'app',
  data() {
    return {
      title: 'TIMER',
      timer: null,
      totalTime: setTime * 60,
      resetButton: false,
    };
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => this.countdown(), 1000);
      this.resetButton = true;
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = true;
    },
    resetTimer() {
      this.totalTime = setTime * 60;
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = false;
    },
    countdown() {
      if (this.totalTime >= 1) {
        this.totalTime -= 1;
        if (this.totalTime === 60) {
          console.log('📳');
          navigator.vibrate([500]);
        }
      } else {
        this.totalTime = 0;
        clearInterval(this.timer);
        this.resetTimer();
        document.getElementById('dialog-rounded').showModal();
        console.log('📳');
        navigator.vibrate([500]);
      }
    },
    pad(time) {
      return (time < 10 ? '0' : '') + time;
    },
    toggleFullScreen() {
      const doc = window.document;
      const docEl = doc.documentElement;
      const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen
        || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen
        || doc.webkitExitFullscreen || doc.msExitFullscreen;
      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement
        && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
      } else {
        cancelFullScreen.call(doc);
      }
    },
  },
  computed: {
    minutes() {
      const minutes = Math.floor(this.totalTime / 60);
      return this.pad(minutes);
    },
    seconds() {
      const seconds = this.totalTime - (this.minutes * 60);
      return this.pad(seconds);
    },
  },
};
</script>

<style lang="scss">
html, body, pre, code, kbd, samp {
  font-family: 'Press Start 2P', cursive;
}

body {
  background-color: lighten(#209cee, 30%);
}

menu {
  padding: 0;
}

#app {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #000;
  > div {
    width: 320px;
    background-color: #fff;
  }
  .num {
    padding: 10px 0;
    font-size: 48px;
  }
  .btns {
    display: flex;
    button {
      flex: 1;
    }
    .is-error {
      flex: none;
      width: 50px;
    }
    .is-success {
      flex: none;
      margin-left: 10px;
      width: 50px;
    }
  }
}
</style>
