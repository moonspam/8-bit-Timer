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
      <div class="btns control">
        <button class="nes-btn" v-if="timer" @click="stopTimer">Pause</button>
        <button class="nes-btn" v-else @click="startTimer">PLAY</button>
        <button class="nes-btn is-warning" v-if="resetButton" @click="resetTimer">RESET</button>
      </div>
      <div class="btns option">
        <button class="nes-btn" :class="{'is-error': !timer, 'is-disabled': timer}"
          @click="totalTime > 0 ? totalTime -= 10 : totalTime = 0"
          :disabled="timer">-</button>
        <button class="nes-btn" :class="{'is-primary': !timer, 'is-disabled': timer}"
          @click="totalTime < 5940 ? totalTime += 10 : totalTime = 5940"
          :disabled="timer">+</button>
        <button class="nes-btn is-success full" @click="toggleFullScreen">F11</button>
      </div>
    </div>
    <div class="footer">
      <a href="https://github.com/moonspam/8-bit-Timer">@GitHub</a>
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
const noSleep = new NoSleep(); // no sleep event

export default {
  name: 'app',
  data() {
    return {
      title: 'TIMER',
      timer: null,
      totalTime: 15 * 60,
      resetButton: false,
    };
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => this.countdown(), 1000);
      this.resetButton = true;
      noSleep.enable(); // no sleep event
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = true;
      noSleep.disable(); // no sleep event
    },
    resetTimer() {
      clearInterval(this.timer);
      this.totalTime = 15 * 60;
      this.timer = null;
      this.resetButton = false;
      noSleep.disable(); // no sleep event
    },
    countdown() {
      if (this.totalTime >= 1) {
        this.totalTime -= 1;
        if (this.totalTime === 300) {
          navigator.vibrate([1000]);
        }
      } else {
        clearInterval(this.timer);
        this.totalTime = 0;
        this.resetTimer();
        document.getElementById('dialog-rounded').showModal();
        navigator.vibrate([1000]);
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
      button {
        flex: 1;
      }
      &.option {
        margin-top: 10px;
        .full {
          margin-left: 10px;
        }
      }
    }
  }
  .footer {
    padding: 10px 0;
    a {
      opacity: 0.5;
      color: #000;
    }
  }
}
</style>
