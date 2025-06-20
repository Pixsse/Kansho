<template>
  <div class="layout">
    <!-- Menu button -->
    <div class="sidebar-toggle-btn main-icon" @click="sidebarOpen = !sidebarOpen">
      <Menu class="icon-menu-size" v-if="!sidebarOpen" />
      <X class="icon-menu-size" v-else />
    </div>

    <!-- Background overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay"></div>

    <!-- Sidebar -->
    <aside
      class="main-bg-card main-border main-radius main-border-1 sidebar"
      :class="{ 'sidebar--open': sidebarOpen }"
    >
      <NavSidebar
        :LibraryNav="LibraryNav"
        :SubLangNav="SubLangNav"
        :PlaybackNav="PlaybackNav"
        :ActionsNav="ActionsNav"
        :SettingsNav="SettingsNav"
      />
    </aside>

    <!-- Main content -->
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, watch, type Ref } from 'vue'
// Lucid
import { Menu, X } from 'lucide-vue-next';
// Utils
import { setSidebarState, getSidebarState } from '~/utils/storageUtils'
// Components
import NavSidebar from '~/components/ui/NavSidebar.vue'


const sidebarOpen: Ref<boolean> = ref(true)

onMounted(() => {
  const storageValue = getSidebarState()
  sidebarOpen.value = storageValue === 'true'
})

watch(sidebarOpen, val => setSidebarState(val.toString()))


const LibraryNav = [
  { href: '/', label: 'My Media' },
  { href: '/', label: 'Favorites' },
  { href: '/', label: 'Playlists' },
  { href: '/', label: 'History' },
]
const SubLangNav = [
  { href: '/', label: 'Manage Subtitles' },
  { href: '/', label: 'Import Subtitles' },
]
const PlaybackNav = [
  { href: '/', label: 'Resume Last Media' },
  { href: '/', label: 'Chapters / Bookmarks' },
]
const ActionsNav = [
  { href: '/', label: 'Import Media' },
]
const SettingsNav = [
  { href: '/', label: 'Settings' },
]

</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.sidebar-toggle-btn {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 105;
  cursor: pointer;
  transition: background 0.2s;
}

.icon-menu-size {
  width: 30px;
  height: 30px;
}

.main-border-1 {
  border-width: 1px;
}

.sidebar--open {
  transform: translateX(0);
}

.sidebar-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #888;
  cursor: pointer;
}

.main-content {
  flex: 1;
  padding: 2.5rem 2rem;
  margin-left: 0;
  min-width: 0;
  align-content: center;
}
</style>
