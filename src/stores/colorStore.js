import { reactive, ref } from 'vue'

export const selectedColorIndex = ref(2);
export const canvasColor = "#FFFFFF"; // grid background color
export const bgColor = ref("#ACACAC"); // 2D and 3D visualization background color

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
        color: null,
        show: false,
    },
    {
        color: null,
        show: false,
    },
    {
        color: null,
        show: false,
    },
    {
        color: null,
        show: false,
    },
    {
        color: null,
        show: false,
    },
    {
        color: null,
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
    palette[index].color = null;
}

export function changeSelectedColor(index) {
    selectedColorIndex.value = index;
}

export function changeBgColor() {
    if (bgColor.value == "#ACACAC") {
        bgColor.value = "#707070";
    } else {
        bgColor.value = "#ACACAC";
    }
}

// Hydrate from sessionStorage
export function setPalette(newPalette) {
    palette.splice(0, palette.length, ...newPalette);
}