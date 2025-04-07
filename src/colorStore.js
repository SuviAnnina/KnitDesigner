import { reactive, ref } from 'vue'

export const selectedColorIndex = ref(1);

export const canvasColor = "#EDF9EB";

export const palette = reactive([
    // TODO: color indexes moved up; index 0 now no-color/empty; usable colors 1-8; yarnmanager logic changes
    {
        color: "#000000",
        show: false,
    },
    {
        color: "#ba9cba",
        show: true,
    },
    {
        color: "#00FF00",
        show: true,
    },
    {
        color: "#0000FF",
        show: true,
    },
    {
        color: "#FFFF00",
        show: true,
    },
    {
        color: "#FF00FF",
        show: true,
    },
    {
        color: "#00FFFF",
        show: true,
    },
    {
        color: "#FF8000",
        show: true,
    },
    {
        color: "#8000FF",
        show: true,
    },
])

export function updateColor(index, colorCode) {
    palette[index].color = colorCode;
}

export function updateShow(index, boolean) {
    palette[index].show = boolean;
}

export function setColorEmpty(index) {
    palette[index].color = '';
}

export function changeSelectedColor(index) {
    selectedColorIndex.value = index;
}