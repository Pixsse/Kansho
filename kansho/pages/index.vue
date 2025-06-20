<template>
  <div class="main-bg-background flex items-center justify-center">
    <div class="w-full flex flex-col items-center">
      <!-- Card Upload -->
      <VideoUploader
        @selected="onVideoSelected"
        v-if="!videoUrl"
        class="main-main-border main-radius flex flex-col items-center justify-center border-2 border-dashed main-border-accent card-size"
      >
        <Import />
      </VideoUploader>

      <!-- Video Player Card -->
      <div
        v-else
        class="relative main-bg-card main-radius w-[1000px] max-w-full mt-6 flex flex-col items-center"
        @mousemove="showAndAutoHideControls"
      >
        <!-- Video -->
        <video
          ref="player"
          :src="videoUrl"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @volumechange="onVolumeChange"
          class="w-full main-radius main-bg-background"
        >
          <track
            kind="subtitles"
            label="JP"
            srclang="jp"
            :src="trackUrl"
            default
          />
        </video>

        <!-- Custom Controls Overlay : UNE SEULE FOIS -->
        <div
          class="custom-controls w-full"
          v-show="showControls"
          @mousemove.stop="showAndAutoHideControls"
        >
          <div @click="togglePlay">
            <Pause v-if="isPlaying" />
            <Play v-else/>
          </div>

          <div class="progress-bar" @mousedown="startSeek" @click="seek">
            <div
              class="progress-filled"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
          <span class="time main-text-muted-foreground">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>

          <!-- Sound button -->
          <div @click="toggleMute">
            <VolumeX v-if="isMuted" />
            <VolumeOff v-else-if="getCurrentVolume() <= 0.01" />
            <Volume v-else-if="getCurrentVolume() > 0.01 && getCurrentVolume() < 0.33" />
            <Volume1 v-else-if="getCurrentVolume() >= 0.33 && getCurrentVolume() < 0.66" />
            <Volume2 v-else />
          </div>

          <input
            class="volume-slider main-border-accent"
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="volume"
            @input="changeVolume"
          />
        </div>

        <div
          v-if="subtitleText"
          class="subtitle-overlay absolute inset-0 flex items-end justify-center pb-4 main-text-foreground text-lg pointer-events-none"
        >
          <span class="subtitle-text">{{ subtitleText }}</span>
        </div>
      </div>

      <SubtitleUploader class="mt-4" @selected="onSubtitleSelected" />
    </div>
  </div>
</template>


<script setup lang="ts">
// Vue
import { ref, computed, nextTick } from "vue";
// Lucide
import { Import, Pause, Play, Volume, Volume1, Volume2, VolumeOff, VolumeX  } from "lucide-vue-next";
// Utils
import { loadVideo, loadSubtitle } from "~/utils/videoUtils";
// Components
import VideoUploader from "~/components/uploader/VideoUploader.vue";
import SubtitleUploader from "~/components/uploader/SubtitleUploader.vue";

const player = ref<HTMLVideoElement>();
const videoUrl = ref<string>("");
const trackUrl = ref<string>("");
const subtitleText = ref("");

const isPlaying = ref(false);
const isMuted = ref(false);
const volume = ref(1);
const currentTime = ref(0);
const duration = ref(0);
const isSeeking = ref(false);
const showControls = ref(true)
const hideDelay = 2000

let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null

function showAndAutoHideControls() {
  showControls.value = true
  if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
  hideControlsTimeout = setTimeout(() => {
    showControls.value = false
  }, hideDelay)
}

function togglePlay() {
  if (!player.value) return;
  if (player.value.paused) {
    player.value.play();
    isPlaying.value = true;
  } else {
    player.value.pause();
    isPlaying.value = false;
  }
}
function toggleMute() {
  if (!player.value) return;
  player.value.muted = !player.value.muted;
  isMuted.value = player.value.muted;
}
function changeVolume() {
  if (!player.value) return;
  player.value.volume = volume.value;
  player.value.muted = volume.value === 0;
  isMuted.value = player.value.muted;
}
function onVolumeChange() {
  if (!player.value) return;
  isMuted.value = player.value.muted;
  volume.value = player.value.volume;
}
function getCurrentVolume() {
  if (!volume.value) return 0;
  return volume.value;
}
function onTimeUpdate() {
  if (!player.value) return;
  currentTime.value = player.value.currentTime;
}
function onLoadedMetadata() {
  if (!player.value) return;
  duration.value = player.value.duration;
}
function seek(event: MouseEvent) {
  if (!player.value || !duration.value) return;
  const bar = event.currentTarget as HTMLElement;
  const rect = bar.getBoundingClientRect();
  const percent = Math.min(
    Math.max((event.clientX - rect.left) / rect.width, 0),
    1
  );
  player.value.currentTime = percent * duration.value;
  currentTime.value = player.value.currentTime;
}
function startSeek(event: MouseEvent) {
  if (!player.value || !duration.value) return;
  isSeeking.value = true;
  seekToEvent(event);
  window.addEventListener("mousemove", seekToEvent);
  window.addEventListener("mouseup", stopSeek);
}
function seekToEvent(event: MouseEvent) {
  if (!player.value || !duration.value) return;
  const bar = document.querySelector(".progress-bar") as HTMLElement;
  const rect = bar.getBoundingClientRect();
  const percent = Math.min(
    Math.max((event.clientX - rect.left) / rect.width, 0),
    1
  );
  player.value.currentTime = percent * duration.value;
  currentTime.value = player.value.currentTime;
}
function stopSeek() {
  isSeeking.value = false;
  window.removeEventListener("mousemove", seekToEvent);
  window.removeEventListener("mouseup", stopSeek);
}
function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
const progressPercent = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0
);

function onVideoSelected(file: File) {
  loadVideo(file, videoUrl, trackUrl);
}
async function onSubtitleSelected(file: File) {
  await loadSubtitle(file, trackUrl);
  await nextTick();
  setupSubtitles();
}
function setupSubtitles() {
  if (!player.value) return;
  const tt = Array.from(player.value.textTracks || []).find(
    (t) => t.kind === "subtitles"
  );
  if (!tt) return;
  tt.mode = "hidden";
  tt.addEventListener("cuechange", () => {
    const cues = Array.from(tt.activeCues || []) as VTTCue[];
    subtitleText.value = cues.length ? cues[0].text : "";
  });
}
</script>

<style scoped>
.custom-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(transparent 60%, rgba(0, 0, 0, 0.85) 100%);
  padding: 12px;
  z-index: 5;
}
button {
  background: rgba(20, 20, 20, 0.7);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  padding: 4px 10px;
  cursor: pointer;
}
.progress-bar {
  flex: 1;
  height: 8px;
  background: #333;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
  position: relative;
  overflow: hidden;
}
.progress-filled {
  height: 100%;
  background: #eee;
  border-radius: 5px 0 0 5px;
}
.time {
  color: #fff;
  font-size: 0.95rem;
  min-width: 70px;
  text-align: center;
}
.volume-slider {
  width: 80px;
}

video::cue {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 1.2rem;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
  white-space: pre-wrap;
}
.card-size {
  width: 360px;
  min-height: 260px;
}
.subtitle-overlay {
  position: absolute;
  bottom: 5rem;
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
  margin-bottom: 125px;
  border-radius: 0.2em;
  pointer-events: auto;
  user-select: text;
  text-shadow: -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000,
    3px 3px 0 #000;
}
</style>
