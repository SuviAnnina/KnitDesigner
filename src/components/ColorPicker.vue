<script setup>
import { setColorEmpty, palette, updateShow, changeSelectedColor } from '../colorStore';
import deleteIcon from '../assets/icons/delete.svg';
import selectIcon from '../assets/icons/select.svg';

const props = defineProps({
    index: Number
});

const handleDeleteColorPicker = (index) => {
    setColorEmpty(index);
    updateShow(index, false);
}

const handleSelectedColor = (index) => {
    changeSelectedColor(index);
} 
</script>

<template>
    <div class="hover:bg-gray-200 hover:scale-102 transition-all duration-200 cursor-pointer"
        @click="handleSelectedColor(index)">
        <div class="flex items-center space-x-2 space-y-0.5">
            <button @click="handleDeleteColorPicker(index)" v-if="index !== 0" class="cursor-pointer">
                <img :src="deleteIcon" alt="Delete" class="icon w-6 h-6" />
            </button>
            <input type="color" v-model.lazy="palette[props.index].color" class="color-input" />
            <button @click="handleSelectedColor(index)" class="cursor-pointer">
                <img :src="selectIcon" alt="Select" class="icon w-6 h-6" />
            </button>
        </div>
    </div>
</template>