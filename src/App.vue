<script setup>
import YarnManager from './components/YarnManager.vue';
import P5Grid from './components/P5Grid.vue';
import { onMounted, onUnmounted } from "vue";
import PatternImage from './components/PatternImage.vue';
import KnitModel from './components/KnitModel.vue';

const handleBeforeUnload = (event) => {
  event.preventDefault();
  event.returnValue = "";
};

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <div class="flex flex-wrap h-screen">
    <!-- Left Side -->
    <div class="w-full sm:w-full lg:w-full xl:w-1/5 2xl:w-1/6 py-4 px-1">
      <div class="flex space-x-2 justify-center">
        <YarnManager />
        <P5Grid />
      </div>
    </div>

    <!-- Right Side -->
    <div
      class="w-full sm:w-full lg:w-full xl:w-4/5 2xl:w-5/6 py-4 px-2 flex flex-col lg:flex-col 2xl:flex-row lg:space-x-4 2xl:space-x-4">
      <div class="w-full lg:w-3/5 xl:ml-10 2xl:w-3/5">
        <PatternImage />
      </div>

      <div class="w-full lg:w-2/5 2xl:w-2/5 mt-4 lg:mt-0 xl:ml-10 xl:mt-5 2xl:mt-0" id="renderKnitModel">
        <KnitModel />
      </div>
    </div>
  </div>
</template>