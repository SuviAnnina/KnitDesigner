<script setup>
import { ref, watch, defineProps } from "vue";
import { updateColor, setColorEmpty, palette, updateShow, selectedColorIndex, changeSelectedColor } from '../colorStore';
import deleteIcon from '../assets/icons/delete.svg';
import selectIcon from '../assets/icons/select.svg';

const props = defineProps({
    index: Number
});

const color = ref(palette[props.index].color);

watch(color, (newColor) => {
    updateColor(props.index, newColor);
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
    <div class="hover:bg-gray-200 hover:scale-101 transition-all duration-200 cursor-pointer"
        @click="handleSelectedColor(index)">
        {{ index === 0 ? 'Main Color' : 'Color' }}
        <input type="color" v-model.lazy="color" />
        <!--         <input v-model.lazy="color" placeholder="123456"/> -->
        <button @click="handleDeleteColorPicker(index)" v-if="index !== 0" class="cursor-pointer">
            <img :src="deleteIcon" alt="Delete" class="icon w-6 h-6" />
        </button>
        <button @click="handleSelectedColor(index)" class="cursor-pointer">
            <img :src="selectIcon" alt="Select" class="icon w-6 h-6" />
        </button>
    </div>
</template>