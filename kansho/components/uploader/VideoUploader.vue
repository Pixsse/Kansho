<template>
  <label class="flex flex-col">
    <span class="font-medium text-center">Import a media file</span>
    <input
      type="file"
      accept=".mp4,.mkv"
      @change="onFile"
      class="mt-2 p-2 rounded-lg cursor-pointer transition"
    />
  </label>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'selected', file: File): void
}>()

function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const name = file.name.toLowerCase()
  if (!name.endsWith('.mp4') && !name.endsWith('.mkv')) return

  emit('selected', file)
}
</script>

