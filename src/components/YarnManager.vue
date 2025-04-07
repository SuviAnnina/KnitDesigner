<script setup>
import ColorPicker from './ColorPicker.vue';
import { palette, updateColor, updateShow } from '../colorStore';
import addIcon from '../assets/icons/add.svg';

// TODO: change logic to display colorpickers 1...9

const handleAddColorPicker = () => {
  // Find empty color slot
  const emptySlotIndex = Object.keys(palette).find(
    index => palette[index].color === ''
  );

  if (emptySlotIndex) {
    updateColor(emptySlotIndex, '#ffffff');
    updateShow(emptySlotIndex, true);
    // console.log('empty slot index:',emptySlotIndex);
  }
  else {
    alert("You can't add more than 8 colors!");
  }
  // for (const color in palette){
  //     console.log(`${color}: ${palette[color].color}`);
  // }
};

</script>
<template>
  <div>
    <div v-for="(colorObject, index) in palette" :key="index" v-show="palette[index].show">
      <ColorPicker :index="index" />
    </div>

    <div class="w-full mt-4 flex justify-center">
      <button @click="handleAddColorPicker" class="cursor-pointer">
        <img :src="addIcon" alt="Add" class="icon w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style>
input[type="color"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  background: none;
  width: 25px !important;
  height: 25px !important;
  padding: 0;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border-radius: 20px;
}
</style>