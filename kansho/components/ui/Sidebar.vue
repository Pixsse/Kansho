<template>
  <nav class="sidebar-content main-bg-card main-border main-radius" style="border-width:1px;">
    <div>
      <h3 class="main-text-muted-foreground">Library</h3>
      <a
        v-for="item in LibraryNav"
        :key="item.label"
        :href="item.href"
        class="main-text-foreground main-radius sidebar-link"
      >
        {{ item.label }}
      </a>
    </div>
    <div>
      <h3 class="main-text-muted-foreground">Subtitles & Languages</h3>
      <a
        v-for="item in SubLangNav"
        :key="item.label"
        :href="item.href"
        class="main-text-foreground main-radius sidebar-link"
      >
        {{ item.label }}
      </a>
    </div>

    <div>
      <h3 class="main-text-muted-foreground">Playback</h3>
      <a
        v-for="item in PlaybackNav"
        :key="item.label"
        :href="item.href"
        class="main-text-foreground main-radius sidebar-link"
      >
        {{ item.label }}
      </a>
    </div>

    <div>
      <h3 class="main-text-muted-foreground">Actions</h3>
      <a
        v-for="item in ActionsNav"
        :key="item.label"
        :href="item.href"
        class="main-text-foreground main-radius sidebar-link"
      >
        {{ item.label }}
      </a>
    </div>
       
    <div>
      <h3 class="main-text-muted-foreground">Settings</h3>
      <a
        v-for="item in SettingsNav"
        :key="item.label"
        :href="item.href"
        class="main-text-foreground main-radius sidebar-link"
      >
        {{ item.label }}
      </a>
      <hr>
      <div class="main-text-foreground theme">
        <span class="flex-1">Theme</span>
          <USwitch
            color="neutral"
            size="xl"
            v-model="isDark"
            unchecked-icon="i-lucide-moon"
            checked-icon="i-lucide-sun"
          />
      </div>
    </div>
  </nav>
</template>

<script setup>
// Vue
import { ref } from 'vue';

const isDark = ref(false)

defineProps({
  LibraryNav: { type: Array, default: () => [] },
  SubLangNav: { type: Array, default: () => [] },
  PlaybackNav: { type: Array, default: () => [] },
  ActionsNav: { type: Array, default: () => [] },
  SettingsNav: { type: Array, default: () => [] },
})

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
  localStorage.setItem('theme', val ? 'dark' : 'light')
})
</script>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 7rem 1.5rem 1.5rem 1.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.1rem;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.5rem 0.7rem;
  transition: background 0.15s, color 0.15s;
}

.sidebar-link:hover {
  background: hsl(var(--accent));
  color: hsl(var(--primary));
}

.theme {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.1rem;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.5rem 0.7rem;
  transition: background 0.15s, color 0.15s;
}

hr {
  margin-bottom: 1rem;
  margin-top: 2rem;
  opacity: 0.5;
}

h3 {
  text-transform: uppercase;
  font-size: 0.6rem;
  letter-spacing: 0.09em;
  margin-bottom: 0.6rem;
  margin-top: 0;
  font-weight: bold;
}
</style>
