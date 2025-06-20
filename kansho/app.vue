<template>
  <head>
  
  </head>
  <div class="main-bg-background ">
    <NuxtLayout name="sidebar">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>


<script>
  try {
    const theme = localStorage.getItem('theme');
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
</script>