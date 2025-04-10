import { reactive, ref } from 'vue'

export const selectedColorIndex = ref(2);

export const canvasColor = "#FFFFFF";

export const palette = reactive([
    {
        color: "#000000",
        show: false,
    },
    {
        color: "#ffffff",
        show: true,
    },
    {
        color: "#9eb39d",
        show: true,
    },
    {
        color: "",
        show: false,
    },
    {
        color: "",
        show: false,
    },
    {
        color: "",
        show: false,
    },
    {
        color: "",
        show: false,
    },
    {
        color: "",
        show: false,
    },
    {
        color: "",
        show: false,
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