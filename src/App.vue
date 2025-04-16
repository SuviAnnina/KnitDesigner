<script setup>
import YarnManager from './components/YarnManager.vue';
import P5Grid from './components/P5Grid.vue';
import { onMounted, watch } from "vue";
import PatternImage from './components/PatternImage.vue';
import KnitModel from './components/KnitModel.vue';

import { getSavedSession, updateSavedSession } from './saveSession';
import { palette, setPalette } from './colorStore';
import { grid, setGrid } from './gridStore';
import { selectedTemplate, setSelectedTemplate } from './templateStore';

watch(palette, () => {
  updateSavedSession({ palette: JSON.parse(JSON.stringify(palette)) });
})

watch(grid,() => {
  updateSavedSession({ grid: JSON.parse(JSON.stringify(grid)) });
})

watch(selectedTemplate, () => {
  updateSavedSession({ selectedTemplate: selectedTemplate.value.size });
})

onMounted(() => {
  const saved = getSavedSession();

  if (saved && Object.keys(saved).length > 0){
    if (saved.palette){
      setPalette(saved.palette);
    }
    if (saved.grid){
      setGrid(saved.grid)
    }
    if (saved.selectedTemplate){
      setSelectedTemplate(saved.selectedTemplate)
    }
  }
});
</script>

<template>
  <div class="flex flex-wrap h-screen">

    <!-- Left Side -->
    <div class="w-full xl:w-1/5 2xl:w-1/6 py-4 px-1">
      <div class="flex space-x-5 justify-center">
        <YarnManager />
        <P5Grid />
      </div>
    </div>

    <!-- Right Side -->
    <div
      class="w-full xl:w-4/5 2xl:w-5/6 py-4 px-2 flex flex-col xl:flex-col 2xl:flex-row xl:space-x-0 2xl:space-x-4">
      <div
        id="yoke"
        class="w-full 2xl:w-3/5 xl:px-10 lg:px-6 md:px-6 sm:px-4 px-2">
        <PatternImage />
      </div>

      <div
        id="renderKnitModel"
        class="w-full 2xl:w-2/5 mt-4 2xl:mt-0 xl:px-10 lg:px-6 md:px-6 sm:px-4 px-2 flex flex-col">
        <KnitModel />
      </div>
    </div>
  </div>
</template>