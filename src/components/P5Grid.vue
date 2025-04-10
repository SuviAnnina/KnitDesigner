<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue";
import p5 from "p5";
import { palette, selectedColorIndex, canvasColor } from "../colorStore";
import { ref } from 'vue';
import { setSelectedTemplate } from "../templateStore";
import { clearGrid, setGridValue, getGridLength, getRow } from '../gridStore'
import saveIcon  from '../assets/icons/save.svg';

let p5Instance;
const chosenSize = ref("S");
const squareWidth = 16;

const handleClearGrid = () => {
    const isConfirmed = confirm("Are you sure you want to clear grid?");

    if (isConfirmed) {
        clearGrid();
        p5Instance.redraw();
    }
}

const sketch = (p) => {
    p.setup = () => {
        let canvas = p.createCanvas(140, 810);
        canvas.parent('p5-container');
        p.background(canvasColor);
        p.noLoop();

        const button = p.createButton('');
        button.parent('p5-container');

        const saveImg = p5Instance.createImg(saveIcon, 'Save');
        saveImg.addClass('icon w-5 h-5');
        button.child(saveImg);
        button.addClass('absolute top-0 right-0 px-1 py-0.5 text-md rounded-lg hover:bg-green-400 focus:outline-none cursor-pointer');
        button.mousePressed(() => {
            p5Instance.save("pattern.png")
        });
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
});

onBeforeUnmount(() => {
    p5Instance.remove();
});
</script>

<template>
    <div class="flex flex-col items-center space-y-4">
        <div class="flex flex-row space-x-8 content-around">
            <select name="size" id="size" v-model="chosenSize" class="p-0.25 border rounded-md cursor-pointer">
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>
            <button @click="handleClearGrid"
                class="px-1.5 py-0.75 text-md bg-red-400 text-black rounded-lg hover:bg-red-500 focus:outline-none cursor-pointer">
                Clear
            </button>
        </div>

        <div id="p5-container" class="relative"></div>
    </div>
</template>