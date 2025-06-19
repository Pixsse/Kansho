<template>
  <label class="flex flex-col">
    <span class="font-medium">Choisir un sous-titre (SRT ou VTT)</span>
    <input
      type="file"
      accept=".srt,.vtt"
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
  if (!name.endsWith('.srt') && !name.endsWith('.vtt')) return


  emit('selected', file)
}
</script>
