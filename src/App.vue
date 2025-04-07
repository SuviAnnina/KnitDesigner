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
  <!--   <div>
    <br />
    <br />
    <div class="container">
      <YarnManager />
      <P5Grid />
      <div id="renderKnitModel">
        <PatternImage />
        <KnitModel />
      </div>
    </div>
  </div> -->

  <div class="flex h-screen">
    <!-- Left Side (30% width) -->
    <div class="w-1/3 p-4">
      <div class="flex space-x-4">
        <YarnManager />
        <P5Grid />
      </div>
    </div>

    <!-- Right Side (70% width) -->
    <div class="w-2/3 p-4 flex flex-col space-y-4">
      <div class="flex-1">
        <PatternImage />
      </div>
    </div>
    <!-- <div class="flex-1">
        <div id="renderKnitModel">
          <KnitModel />
        </div>
      </div> -->


    <!--     <div id="renderKnitModel">
      <KnitModel />
    </div> -->
  </div>
</template>