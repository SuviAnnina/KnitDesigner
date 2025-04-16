<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import p5 from "p5";
import { palette, selectedColorIndex, canvasColor } from "../stores/colorStore";
import { selectedTemplate, setSelectedTemplate } from "../stores/templateStore";
import { clearGrid, setGridValue, getGridLength, getRow } from '../stores/gridStore'
import ConfirmModal from "./ConfirmModal.vue";
import saveIcon  from '../assets/icons/save.svg';

let p5Instance;
let blockClick = false;
const selectedSize = computed({
  get: () => selectedTemplate.value.size,
  set: (val) => setSelectedTemplate(val)
});
const squareWidth = 16;
const showConfirmModal = ref(false);

const sketch = (p) => {
    p.setup = () => {
        let canvas = p.createCanvas(140, 810);
        canvas.parent('p5-container');
        p.background(canvasColor);
        p.noLoop();

        const button = p.createButton('');
        button.parent('p5-container');

        const saveImg = p.createImg(saveIcon, 'Save');
        saveImg.addClass('icon w-5 h-5');
        button.child(saveImg);
        button.addClass('absolute top-0 right-0 px-1 py-0.5 text-md rounded-lg hover:bg-green-400 focus:outline-none cursor-pointer');
        button.mousePressed(() => {
            p.save("pattern.png")
        });
    };

    p.draw = () => {
        p.background(canvasColor);
        // rectangles bordercolor either black or white depending on mainColor
        // let rectBorderColor = p.color(palette[1].color);
        // p.stroke(p.brightness(rectBorderColor) < 50 ? 255 : 0);

        // draws the grid
        for (let y = 0; y < getGridLength(); y++) {
            let row = getRow(y);
            for (let x = 0; x < 8; x++) {
                if (row[x] === 0) {
                    continue;
                }
                // let colorEntry = palette[row[x]];
                // let fillColor = colorEntry && typeof colorEntry.color === "string" ? colorEntry.color : palette[1].color;
                // p.fill(fillColor);
                // p.stroke(getContrast(fillColor, p));
                p.fill(palette[row[x]].color);
                p.stroke(getContrast(palette[row[x]].color, p));
                p.square(x * squareWidth, y * squareWidth, squareWidth);
            }
        }
    };

    // handles the mouseclick for setting a squares color
    p.mouseClicked = () => {
        if (/* showConfirmModal.value */ blockClick || p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
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

const getContrast = (color, p) => {
    const brightness = p.brightness(color);
    const darkness = 100 - brightness;
    let contrast = mapCurve(darkness, 0, 100, 0, 255, easeInOutExpo);

    const offset = 125; // corrects the color to avoid similar tones
    if (brightness >= 45 && brightness <= 55){ 
        contrast += offset;
    }
    return contrast;
}

const mapCurve = (value, inMin, inMax, outMin, outMax, easingFn) => {
    let t = (value - inMin) / (inMax - inMin);
    t = easingFn(t);
    return outMin + (outMax - outMin) * t;
}

const easeInOutExpo = t =>
    t === 0 ? 0 :
    t === 1 ? 1 :
    t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;

const confirmClear = () => {
    clearGrid();
    p5Instance.redraw();
    showConfirmModal.value = false;

    setTimeout(() => {
        blockClick = false;
    }, 100);
};

const cancelClear = () => {
    showConfirmModal.value = false;

    setTimeout(() => {
        blockClick = false;
    }, 100);
};

const openConfirmModal = () => {
    blockClick = true;
    showConfirmModal.value = true;
};

watch(palette, () => {
    p5Instance.redraw();
})

watch(selectedSize, () => {
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
            <select name="size" id="size" v-model="selectedSize" class="p-0.25 border rounded-md cursor-pointer">
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>

            <button 
                @click="openConfirmModal"
                class="px-1.5 py-0.75 text-md bg-red-400 text-black rounded-lg hover:bg-red-500 focus:outline-none cursor-pointer">
                Clear 
            </button>   

            <Teleport to="body">
                <ConfirmModal 
                    v-if="showConfirmModal"
                    :message="'Clear grid?'"
                    @confirm="confirmClear"
                    @cancel="cancelClear"
                    :buttons="['yes', 'cancel']"
                />
             </Teleport>

        </div>

        <div id="p5-container" class="relative"></div>
    </div>
</template>