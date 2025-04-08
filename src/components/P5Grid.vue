<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue";
import p5 from "p5";
import { palette, selectedColorIndex, canvasColor } from "../colorStore";
import { ref } from 'vue';
import { setSelectedTemplate } from "../templateStore";
import { clearGrid, setGridValue, getGridLength, getRow } from '../gridStore'

let p5Instance;
const chosenSize = ref("S");
const squareWidth = 16;

const handleClearGrid = () => {
    const isConfirmed = confirm("Are you sure you want to clear canvas?");

    if (isConfirmed) {
        clearGrid();
        p5Instance.redraw();
    }
}

const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(140, 810);
        p.background(canvasColor);
        p.noLoop();
    };

    p.draw = () => {
        p.background(canvasColor);
        // rectangles bordercolor either black or white depending on mainColor
        let rectBorderColor = p.color(palette[1].color);
        p.stroke(p.brightness(rectBorderColor) < 50 ? 255 : 0);

        // draws the grid
        for (let y = 0; y < getGridLength(); y++) {
            let row = getRow(y);
            for (let x = 0; x < 8; x++) {
                if (row[x] === 0) {
                    continue;
                }
                p.fill(palette[row[x]].color);
                p.square(x * squareWidth, y * squareWidth, squareWidth);
            }
        }
    };

    // handles the mouseclick for setting a squares color
    p.mouseClicked = () => {
        if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
            return
        }
        const x = p.floor(p.mouseX / squareWidth);
        let y = p.floor(p.mouseY / squareWidth);

        // clicking outside visible grid does nothing
        if (y >= getGridLength() || x >= 8) {
            return
        }
        const row = getRow(y);
        if (row[x] === 0) {
            return
        }

        // sets square to chosen color or main color
        if (row[x] !== selectedColorIndex.value) {
            setGridValue(x, y, selectedColorIndex.value);
        } else {
            setGridValue(x, y, 1);
        }
        p.redraw();
    }
}

watch(palette, () => {
    p5Instance.redraw();
})

watch(chosenSize, () => {
    setSelectedTemplate(chosenSize.value);
    p5Instance.redraw();
})

onMounted(() => {
    p5Instance = new p5(sketch, document.getElementById("p5-container"));
    setTimeout(() => {
        const canvas = document.getElementById("defaultCanvas1");
        if (canvas) {
            canvas.style.borderRadius = "2.5rem";
        }
    });
});

onBeforeUnmount(() => {
    p5Instance.remove();
});
</script>

<template>
    <div class="flex flex-col items-center space-y-4">
        <div class="flex flex-row items-center space-x-1">
            <select name="size" id="size" v-model="chosenSize" class="p-0.25 border rounded-md">
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>
            <button @click="handleClearGrid"
                class="px-1.5 py-0.75 text-md bg-red-400 text-white rounded-lg hover:bg-red-500 focus:outline-none cursor-pointer">
                Clear
            </button>
        </div>

        <div id="p5-container" class="p5-container"></div>
    </div>
</template>