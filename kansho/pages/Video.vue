<template>
  <div class="">
    <div class="">
      <div class="">
        <VideoUploader    @selected="onVideoSelected" />
        <SubtitleUploader @selected="onSubtitleSelected" />
      </div>
      <client-only>
        <div class="relative">
          <!-- Video -->
          <video
            ref="player"
            v-if="videoUrl"
            :src="videoUrl"
            controls
            class="w-full rounded-lg bg-black"
          >
            <track
              kind="subtitles"
              label="JP"
              srclang="jp"
              :src="trackUrl"
              default
            />
          </video>

          <!-- Subtitle overlay -->
          <div
            v-if="subtitleText"
            class="subtitle-overlay absolute inset-0 flex items-end 
                   justify-center pb-4 text-white text-lg"
          >
            <span class="subtitle-text">{{ subtitleText }}</span>
          </div>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref, nextTick } from 'vue'

// Utils
import { loadVideo, loadSubtitle } from '~/utils/videoUtils'

// Components
import VideoUploader from '~/components/uploader/VideoUploader.vue'
import SubtitleUploader from '~/components/uploader/SubtitleUploader.vue'

const player   = ref<HTMLVideoElement>()
const videoUrl = ref<string>('')
const trackUrl = ref<string>('')
const subtitleText = ref('')

function onVideoSelected(file: File) {
  loadVideo(file, videoUrl, trackUrl)
}

async function onSubtitleSelected(file: File) {
  await loadSubtitle(file, trackUrl)
  await nextTick()
  setupSubtitles()
}

function setupSubtitles() {
  if (!player.value) return
  const tt = Array.from(player.value.textTracks || []).find(t => t.kind === 'subtitles')

  if (!tt) return
  tt.mode = 'hidden'

  tt.addEventListener('cuechange', () => {
    const cues = Array.from(tt.activeCues || []) as VTTCue[]
    subtitleText.value = cues.length ? cues[0].text : ''
  })
}

</script>

<style>
video::cue {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 1.2rem;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
  white-space: pre-wrap;
}

.subtitle-overlay {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  max-width: 90%;
  text-align: center;
}

.subtitle-text {
  display: inline-block;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 1.5rem;
  padding: 0.2em 0.3em;
  margin-bottom: 75px;
  border-radius: 0.2em;
  pointer-events: auto;
  user-select: text;
  text-shadow:
    -3px -3px 0 #000,
     3px -3px 0 #000,
    -3px  3px 0 #000,
     3px  3px 0 #000;
}

</style>