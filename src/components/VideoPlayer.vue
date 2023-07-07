<script setup>
import { ref, onMounted } from 'vue'
import flvjs from 'flv.js'

const player = ref(null)
const playerRef = ref(null)

const initPlayer = () => {
  // const url = 'rtsp://192.168.2.236:8557/h264'
  if (flvjs.isSupported()) {
    player.value = flvjs.createPlayer({
      type: 'flv',
      isLive: true,
      url: 'ws://localhost:8888/'
    }, { deferLoadAfterSourceOpen: false })

    player.value.on('error', (e) => {
      console.error(e)
    })

    player.value.attachMediaElement(playerRef.value)

    try {
      player.value.load()
      let controller = player.value._transmuxer._controller 
      let wsLoader = controller._ioctl._loader 
      var oldWsOnCompleteFunc = wsLoader._onComplete 
      wsLoader._onComplete = function () { 
        if (!controller._remuxer) { 
          controller._remuxer = { 
            flushStashedSamples: function () { 
              // _this.loadingVisiable = false 
              console.log("flushStashedSamples") 
            } 
          } 
        } oldWsOnCompleteFunc() 
      }
      player.value.play()
    } catch (error) {
      console.error(error)
    }
  }
}

onMounted(() => {
  initPlayer()
})
</script>
<template>
  <video ref="playerRef" class="video-player" muted autoplay></video>
</template>

<style>
.video-player {
  width: 100%;
  height: auto;
}
</style>