<template>
  <div id="app">
    <div class="nes-container with-title is-centered">
      <h1 class="title">{{ title }}</h1>
      <video src="https://media.giphy.com/media/3o85xI9azPrziRBRkI/giphy.mp4" muted loop autoplay></video>
      <div class="num">
        <span>{{ minutes }}</span>
        <span>:</span>
        <span>{{ seconds }}</span>
      </div>
      <div class="btns">
        <button class="nes-btn" :class="{'is-error': !status, 'is-disabled': status}"
          @click="totalTime > 0 ? totalTime -= 10 : totalTime = 0"
          :disabled="status">-</button>
        <button class="nes-btn" :class="{'is-primary': !status, 'is-disabled': status}"
          @click="totalTime < 5940 ? totalTime += 10 : totalTime = 5940"
          :disabled="status">+</button>
        <button class="nes-btn is-success full" @click="toggleFullScreen">F11</button>
      </div>
      <div class="btns">
        <button class="nes-btn" :class="{'is-disabled': status}"
          @click="changeTimer(5 * 60)" :disabled="status">5</button>
        <button class="nes-btn" :class="{'is-disabled': status}"
          @click="changeTimer(15 * 60)" :disabled="status">15</button>
        <button class="nes-btn" :class="{'is-disabled': status}"
          @click="changeTimer(30 * 60)" :disabled="status">30</button>
        <button class="nes-btn" :class="{'is-disabled': status}"
          @click="changeTimer(60 * 60)" :disabled="status">60</button>
      </div>
      <div class="btns control">
        <button class="nes-btn is-error" v-if="timer" @click="stopTimer">Pause</button>
        <button class="nes-btn is-warning" v-else @click="startTimer">PLAY</button>
        <button class="nes-btn" v-if="status" @click="resetTimer">RESET</button>
      </div>
    </div>
    <div class="footer">
      <a href="https://github.com/moonspam/8-bit-Timer">@GitHub</a>
    </div>

    <dialog class="nes-dialog is-rounded" id="dialog-rounded">
      <form method="dialog">
        <p class="title">Alert</p>
        <p>Time is over.</p>
        <menu class="dialog-menu">
          <button class="nes-btn is-primary">Confirm</button>
        </menu>
      </form>
    </dialog>
  </div>
</template>

<script>
const noSleep = new NoSleep(); // no sleep event
const initTime = 15 * 60;

export default {
  name: 'app',
  data() {
    return {
      title: 'TIMER',
      timer: null,
      totalTime: initTime,
      setTime: initTime,
      status: false,
    };
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => this.countdown(), 1000);
      this.status = true;
      noSleep.enable(); // no sleep event
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.status = true;
      noSleep.disable(); // no sleep event
    },
    changeTimer(e) {
      this.setTime = e;
      this.totalTime = e;
      this.resetTimer();
    },
    resetTimer() {
      clearInterval(this.timer);
      this.totalTime = this.setTime;
      this.timer = null;
      this.status = false;
      noSleep.disable(); // no sleep event
    },
    countdown() {
      if (this.totalTime >= 1) {
        this.totalTime -= 1;
        if (this.totalTime === 300) {
          navigator.vibrate([500, 250, 500]);
        }
      } else {
        const dialog = document.getElementById('dialog-rounded');
        clearInterval(this.timer);
        this.totalTime = 0;
        this.resetTimer();
        dialogPolyfill.registerDialog(dialog);
        dialog.showModal();
        navigator.vibrate([500, 250, 500, 250, 500]);
        noSleep.disable(); // no sleep event
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
  font-size: 14px;
  background: lighten(#209cee, 30%) url('https://media.giphy.com/media/knBA26sv2ueXK/source.gif') no-repeat center center/cover;
}

menu { padding: 0 }

@keyframes burnInDetector {
  20%  {margin: 0 0 0 -4px}
  40%  {margin: -4px 0 0 0}
  60%  {margin: 0 -4px 0 0}
  80%  {margin: 0 0 -4px 0}
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #000;
  .nes-container {
    width: 320px;
    background-color: #fff;
    animation: 60s burnInDetector steps(1, start) infinite;
    video {
      margin: auto;
      width: 70%;
    }
    .num {
      padding: 10px 0;
      font-size: 48px;
    }
    .btns {
      display: flex;
      margin-top: 8px;
      &.control {
        font-size: 16px;
      }
      button {
        flex: 1;
      }
      .full {
        margin-left: 10px;
      }
    }
  }
  .footer {
    padding: 10px 0 0;
    a {
      opacity: 0.5;
      color: #000;
    }
  }
}
</style>
