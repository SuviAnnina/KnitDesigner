<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue";
import { palette, bgColor, changeBgColor } from "../colorStore.js";
import { grid } from "../gridStore.js";
import p5 from "p5";
import { getGridLength, getRowLength, getRow } from "../gridStore.js";
import { selectedTemplate } from "../templateStore.js";
import { setFillerTexture, setFilledYokeTexture } from "../textureStore.js";
import saveIcon  from '../assets/icons/save.svg';
import canvasColorIcon from '../assets/icons/canvas-color.svg'

let p;
const pi = 3.141592653589793;
const tau = 6.283185307179586;

let config = {
    stitch: {
        img: null,
        imgPath: './stitch.png',
        overlapFactor: 0.85,
        width: 32,
        leanAngleOffset: pi * 0.2,
    },
    texture: {
        width: 1000,
        height: 1000,
    },
    canvas: {
        width: 800,
        height: 800,
        // width: 900,
        // height: 900,
    },
    slice: {
        img: null,
        count: 33,
        get innerRadius() {
            return this.count * 3 * config.stitch.width / tau;
        },
        get outerRadius() {
            return config.slice.innerRadius + config.stitch.width + (grid.length - 1) * config.stitch.overlapFactor * config.stitch.width;
        },
        get angle() {
            return tau / this.count;
        }
    },
    yoke: {
        img: null,
        filledImg: null,
    },
    filler: {
        img: null,
    },
}

const sketch = (p5Instance) => {
    p5Instance.preload = () => {
        config.stitch.img = p5Instance.loadImage(config.stitch.imgPath);
    }

    p5Instance.setup = () => {
        let canvas = p5Instance.createCanvas(config.canvas.width, config.canvas.height);
        canvas.parent('2d-pattern-container');

        p5Instance.canvas.style.borderRadius = '2.5rem';

        p5Instance.noLoop();
        p5Instance.imageMode(p5Instance.CORNERS);

        createYoke();
        createFiller();
        createFilledYoke();

        const button = p5Instance.createButton('');
        button.parent('2d-pattern-container');
        const saveImg = p5Instance.createImg(saveIcon, 'Save yoke image');
        saveImg.addClass('icon w-5 h-5');
        button.child(saveImg);
        button.addClass('absolute top-4 right-4 z-10 p-1 rounded-lg hover:bg-green-400 cursor-pointer');
        button.mousePressed(() => {
            config.yoke.img.save("yoke.png")
        });

        const buttonBackground = p5Instance.createButton('');
        buttonBackground.parent('2d-pattern-container');
        const canvasColorImg = p5Instance.createImg(canvasColorIcon, 'Change canvas background color');
        canvasColorImg.addClass('icon w-5 h-5');
        buttonBackground.child(canvasColorImg);
        buttonBackground.addClass('absolute top-4 right-14 z-10 p-1 rounded-lg hover:bg-green-400 cursor-pointer');
        buttonBackground.mousePressed(() => {
            changeBgColor();
            p.redraw();
        });
    };

    p5Instance.draw = () => {
        p5Instance.background(bgColor.value);
        p5Instance.image(config.yoke.img, 0, 0, p5Instance.width, p5Instance.height);
    };
}

const drawStitch = (x, y, angle, colorCode, target) => {
    target.push();
    target.translate(x, y);
    target.rotate(angle);
    target.tint(p.color(colorCode));
    target.image(config.stitch.img, 0, 0);
    target.pop();
}

const createSlice = () => {
    // const startTime = performance.now();
    const graphicHeight = config.slice.outerRadius * Math.tan(config.slice.angle * 0.5) * 2 + config.stitch.width;
    let slice = config.slice;

    slice.img = cleanupGraphic(slice.img);

    slice.img = p.createGraphics(slice.outerRadius, graphicHeight);
    slice.img.imageMode(p.CENTER);
    slice.img.translate(0, graphicHeight * 0.5);
    config.stitch.img.resize(config.stitch.width, config.stitch.width);

    let leanPairIndex = 0;
    const leanPairs = [[4, 5, false], [1, 2, true], [5, 6, false], [0, 1, true], [6, 7, false]];

    const coefficients = [
        [],
        [],
        [],
        [1, 1, 7 / 32, 0, -15 / 64, 1, 1, 1],   
        [1, 1, 7 / 32, 0, -1 / 8 * 1.3, -11 / 32, 1, 1],
        [1, 5 / 16, 1 / 8, 0, -1 / 8 * 1.25, -11 / 32, 1, 1],
        [1, 5 / 16, 1 / 8, 0, -1 / 8 * 1.2, -2 / 8 * 1.1, -7 / 16, 1],
        [3 / 8, 2 / 8, 1 / 8, 0, -1 / 8 * 1.1, -2 / 8 * 1.1, -7 / 16, 1],
        [3 / 8, 2 / 8, 1 / 8, 0, -1 / 8, -2 / 8, -3 / 8, -4 / 8],
    ];

    const spacing = config.stitch.overlapFactor * config.stitch.width;

    for (let y = 0; y < getGridLength(); y++) {
        let row = getRow(y);
        // 1.45 is spread at inner radius, easing function tells how to reach 1.0
        let spread = mapCurve(y, 0, getGridLength(), 1.45, 1, easeOutCirc);
        let r = config.slice.innerRadius + config.stitch.width * 0.5 + y * spacing;
        let needsLean = isMerging(y);
        for (let x = 0; x < 8; x++) {
            // check if there is a stitch to draw
            if (row[x] === 0) {
                continue;
            }
            let theta = coefficients[getRowLength(y)][x] * config.slice.angle * spread;
            let angle = theta - pi * 0.5;

            // checks per x for a lean pair based on the first stitch
            if (needsLean && x == leanPairs[leanPairIndex][0]) {
                let nextTheta = coefficients[getRowLength(y)][x + 1] * config.slice.angle * spread;
                let quarterDistance = (nextTheta - theta) * 0.25;
                let nextAngle = nextTheta - pi * 0.5;

                angle += config.stitch.leanAngleOffset;
                nextAngle -= config.stitch.leanAngleOffset;

                theta += quarterDistance;
                nextTheta -= quarterDistance;

                // Draws right or left leaning stitch on top
                if (leanPairs[leanPairIndex][2]) {
                    drawStitch(polarToX(r, theta), polarToY(r, theta), angle, palette[row[x]].color, slice.img);
                    drawStitch(polarToX(r, nextTheta), polarToY(r, nextTheta), nextAngle, palette[row[x + 1]].color, slice.img);
                }
                else {
                    drawStitch(polarToX(r, nextTheta), polarToY(r, nextTheta), nextAngle, palette[row[x + 1]].color, slice.img);
                    drawStitch(polarToX(r, theta), polarToY(r, theta), angle, palette[row[x]].color, slice.img);
                }

                x++;
                needsLean = false;
                leanPairIndex++;
            } else {
                drawStitch(polarToX(r, theta), polarToY(r, theta), angle, palette[row[x]].color, slice.img);
            }
        }
    }
    // const endTime = performance.now();
    // console.log(`[time] createSlice: ${(endTime - startTime).toFixed(4)} ms, ${((endTime - startTime) / 1000).toFixed(2)} s`);
}

const drawSlice = (sliceNumber) => {
    const theta = config.slice.angle * sliceNumber;
    const r = config.slice.outerRadius * 0.5;

    config.yoke.img.push();
    config.yoke.img.translate(polarToX(r, theta), polarToY(r, theta));
    config.yoke.img.rotate(theta);
    config.yoke.img.image(config.slice.img, 0, 0);
    config.yoke.img.pop();
}

const createYoke = () => {
    createSlice();

    config.yoke.img = cleanupGraphic(config.yoke.img);
    config.yoke.img = p.createGraphics(config.slice.outerRadius * 2, config.slice.outerRadius * 2);
    config.yoke.img.imageMode(p.CENTER);
    config.yoke.img.translate(config.slice.outerRadius, config.slice.outerRadius);

    for (let i = 0; i < config.slice.count; i++) {
        drawSlice(i);
    }
}

const createFiller = () => {
    config.filler.img = cleanupGraphic(config.filler.img);
    config.filler.img = p.createGraphics(config.texture.width, config.texture.height);
    config.filler.img.imageMode(p.CORNER);

    // determine stitch size to visually match yoke's stitch size 
    const scaledStitchWidth = config.stitch.width / (config.stitch.overlapFactor * config.slice.outerRadius * 2 / config.texture.width);
    const fullStitchCount = Math.floor(config.texture.width / scaledStitchWidth);
    const remainderWidth = config.texture.width - fullStitchCount * scaledStitchWidth;
    const spacing = remainderWidth / fullStitchCount;

    config.stitch.img.resize(scaledStitchWidth, 0);

    let oneColumn = p.createGraphics(scaledStitchWidth + spacing, config.texture.height);
    for (let y = scaledStitchWidth * -config.stitch.overlapFactor; y < config.texture.height; y += scaledStitchWidth * config.stitch.overlapFactor) {
        drawStitch(0, y, 0, palette[1].color, oneColumn);
    }

    for (let x = 0; x < config.texture.width; x += scaledStitchWidth + spacing) {
        config.filler.img.image(oneColumn, x, 0);
    }

    setFillerTexture(config.filler.img);

    oneColumn = cleanupGraphic(oneColumn);
}

const createFilledYoke = () => {
    config.yoke.filledImg = cleanupGraphic(config.yoke.filledImg);
    config.yoke.filledImg = p.createGraphics(config.texture.width, config.texture.height);

    drawFillerToCorner(0);
    drawFillerToCorner(1);
    drawFillerToCorner(2);
    drawFillerToCorner(3);

    const sliceMaxRadius = config.slice.innerRadius + config.stitch.width * 0.5 + (getGridLength() - 1) * config.stitch.overlapFactor * config.stitch.width;
    const eraseDiameter = sliceMaxRadius * config.texture.width / config.slice.outerRadius;
    config.yoke.filledImg.erase();
    config.yoke.filledImg.circle(config.texture.width * 0.5, config.texture.height * 0.5, eraseDiameter);
    config.yoke.filledImg.noErase();

    config.yoke.filledImg.imageMode(p.CORNERS);
    config.yoke.filledImg.image(config.yoke.img, 0, 0, config.texture.width, config.texture.height);

    setFilledYokeTexture(config.yoke.filledImg);
}

const drawFillerToCorner = (corner) => {
    config.yoke.filledImg.push();
    config.yoke.filledImg.translate(config.texture.width * 0.5, config.texture.height * 0.5);
    config.yoke.filledImg.imageMode(p.CENTER);
    config.yoke.filledImg.rectMode(p.CENTER);
    config.yoke.filledImg.rotate(pi * -0.25 + pi * 0.5 * corner);
    config.yoke.filledImg.translate(0, config.texture.height * 0.5);
    config.yoke.filledImg.clip(cornerMask);
    config.yoke.filledImg.image(config.filler.img, 0, 0);
    config.yoke.filledImg.pop();
}

const cornerMask = () => {
    config.yoke.filledImg.triangle(0, config.texture.width * -0.5, config.texture.width, config.texture.width * 0.5, -config.texture.width, config.texture.width * 0.5);
}

const cleanupGraphic = (graphic) => {
    if (!graphic) {
        return null
    }
    graphic.remove();
    return undefined;
}

const mapCurve = (value, inMin, inMax, outMin, outMax, easingFn) => {
    let t = (value - inMin) / (inMax - inMin);
    t = easingFn(t);
    return outMin + (outMax - outMin) * t;
}

const easeOutCirc = t => Math.sqrt(1 - Math.pow(t - 1, 2));

watch(palette, () => {
    createYoke()
    createFilledYoke();
    p.redraw();
})

watch(() => palette[1].color, () => {
    createFiller();
    createFilledYoke();
});

watch(grid, () => {
    createYoke();
    createFilledYoke();
    p.redraw();
})

watch(selectedTemplate, () => {
    createYoke();
    createFilledYoke();
    p.redraw();
})

onMounted(() => {
    p = new p5(sketch, document.getElementById("2d-pattern-container"));
    setTimeout(() => {
        const canvas = document.getElementById("defaultCanvas1");
        if (canvas) {
            canvas.style.borderRadius = "2.5rem";
        }
    });
});

onBeforeUnmount(() => {
    p.remove();
});

// checks if the previous row is one shorter
const isMerging = (currentIndex) => {
    if (currentIndex === 0) {
        return false;
    }
    const currentRowLength = getRowLength(currentIndex);
    const previousRowLength = getRowLength(currentIndex - 1);
    return (currentRowLength - previousRowLength === 1);
}

const polarToX = (r, theta) => {
    return r * Math.cos(theta);
}
const polarToY = (r, theta) => {
    return r * Math.sin(theta);
}
</script>

<template>
    <div id="2d-pattern-container" class="relative w-fit h-fit mx-auto"></div>
</template>