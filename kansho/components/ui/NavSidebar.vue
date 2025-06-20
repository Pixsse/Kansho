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
      <h3 class="main-text-muted-foreground">Subtitles</h3>
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
      <hr>
      <div class="main-text-foreground theme">
        <span class="flex-1">Theme</span>
          <USwitch
            color="neutral"
            size="xl"
            v-model="isDarkMode"
            unchecked-icon="i-lucide-moon"
            checked-icon="i-lucide-sun"
          />
      </div>
      <a
        v-for="item in SettingsNav"
        :key="item.label"
        :href="item.href"
        class="main-text-foreground main-radius sidebar-link"
      >
        {{ item.label }}
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Vue
import { ref, watch, onMounted } from 'vue';
//Utils
import { getTheme, setTheme } from '~/utils/storageUtils';

const isDarkMode = ref(false)

defineProps<{
  LibraryNav?: any[]
  SubLangNav?: any[]
  PlaybackNav?: any[]
  ActionsNav?: any[]
  SettingsNav?: any[]
}>()

onMounted(() => {
  const theme = getTheme()
  if (theme) {
    isDarkMode.value = theme === 'dark'
  } else {
    isDarkMode.value = window.matchMedia('dark').matches
  }
  applyTheme(isDarkMode.value)
})

watch(isDarkMode, (val) => {
  applyTheme(val)
})

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  setTheme(dark ? 'dark' : '')
}

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
