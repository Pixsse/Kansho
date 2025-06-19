<template>
<client-only>
  <video
    ref="player"
    v-if="videoUrl"
    :src="videoUrl"
    controls
    class="w-full rounded-lg bg-black"
  >
    <track
      kind="subtitles"
      label="FR"
      srclang="fr"
      :src="trackUrl"
    />
  </video>
  <div
    ref="subtitleDisplay"
    class="mt-2 text-center text-lg text-white bg-black/50 p-2 rounded"
  ></div>
</client-only>
</template>

<script setup lang="ts">

defineProps<{
    videoUrl: string,
    trackUrl: string
}>()

</script>

<style scoped>
video::cue {
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 1.2rem;
}
</style>