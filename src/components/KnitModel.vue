<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { fillerTexture, filledYokeTexture } from '../stores/textureStore.js';
import { ref, onBeforeUnmount, onMounted, watchEffect, watch } from 'vue';
import leftClick from '../assets/icons/mouse-left.svg'
import rightClick from '../assets/icons/mouse-right.svg'
import middleClick from '../assets/icons/mouse-middle.svg'
import { bgColor } from '../stores/colorStore.js';

const canvasContainer = ref(null);
const isCanvasReady = ref(false);

let texture, yokeTexture, filler, filledYoke, material, yokeMaterial;

const scene = new THREE.Scene();
scene.background = new THREE.Color(bgColor.value);

const renderWidth = 450;
const renderHeight = 500;
const aspectRatio = renderWidth / renderHeight;
const camera = new THREE.PerspectiveCamera(66, aspectRatio, 0.1, 1000);
camera.updateProjectionMatrix();
camera.position.set(0, 1, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(renderWidth, renderHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;

const loader = new GLTFLoader();

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(0, 100, 0);
directionalLight.castShadow = true;
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);

scene.add(directionalLight);
scene.add(ambientLight);

controls.update();

const loadFiller = async () => {
    while (!fillerTexture.value && !filledYokeTexture.value) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    filler = fillerTexture.value.canvas;
    texture = new THREE.CanvasTexture(filler);
    material = new THREE.MeshStandardMaterial({ map: texture });
    texture.offset.set(0.785, -0.785);
    texture.center.set(0.5, 0.5);
    texture.repeat.set(3.3, 3.3);
    texture.rotation = Math.PI / 2;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    filledYoke = filledYokeTexture.value.canvas;
    yokeTexture = new THREE.CanvasTexture(filledYoke);
    yokeMaterial = new THREE.MeshStandardMaterial({ map: yokeTexture });
    yokeTexture.offset.set(0.780, -0.790);
    yokeTexture.center.set(0.5, 0.5);
    yokeTexture.repeat.set(2.8, 2.8);
    
    loader.load('/knit3DModel/knitAngleBased.glb', function (gltf) {
        try {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material.name === "Yoke") {
                        child.material = yokeMaterial;
                    } else if (child.material.name === "Sleeves") {
                        child.material = material;
                    } else if (child.material.name === "Body") {
                        child.material = material;
                    }
                }
            });
            scene.add(gltf.scene);
        } catch (error) {
            console.log('Error loading 3D model ', error);
        }
    }, undefined, function (error) {
        console.log('error in gltf scene traverse')
        console.log(error);
    });
}

const updateTexture = () => {
    if (fillerTexture.value && texture) {
        texture.image = fillerTexture.value.canvas;
        texture.needsUpdate = true;
    }

    if (filledYokeTexture.value && yokeTexture) {
        yokeTexture.image = filledYokeTexture.value.canvas;
        yokeTexture.needsUpdate = true;
    }
};

const animate = () => {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

watchEffect(updateTexture);

watch(bgColor, () => {
    scene.background = new THREE.Color(bgColor.value);
})

onMounted(() => {
        canvasContainer.value.appendChild(renderer.domElement);
        renderer.domElement.style.borderRadius = '2.5rem';
        isCanvasReady.value = true;
        loadFiller().then(() => {
            animate();
        });
});

onBeforeUnmount(() => {
    isCanvasReady.value = false;
    scene.traverse((object) => {
        if (object.isMesh) {
            if (object.geometry) object.geometry.dispose();

            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((mat) => {
                        if (mat.map) mat.map.dispose();
                        mat.dispose();
                    });
                } else {
                    if (object.material.map) object.material.map.dispose();
                    object.material.dispose();
                }
            }
        }
    });

    scene.children.forEach((child) => {
        if (child.type === "Scene") {
            scene.remove(child);
        }
    });

    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    renderer.dispose();

    if (renderer.domElement) {
        renderer.domElement.remove();
    }
});
</script>

<template>
    <div class="flex flex-col items-center">
        <!-- 3D knit model -->
        <div ref="canvasContainer" class="mb-4"></div>

        <!-- User guide -->
        <div 
            v-if="isCanvasReady"
            class="flex justify-around text-xs w-4/5"
            >
            <div class="flex flex-row items-center">
                <img :src="leftClick" alt="left click" class="icon w-5 h-5" />
                <span>turn</span>
            </div>

            <div class="flex flex-row items-center">
                <img :src="middleClick" alt="middle click" class="icon w-5 h-5" />
                <span>zoom</span>
            </div>

            <div class="flex flex-row items-center">
                <img :src="rightClick" alt="right click" class="icon w-5 h-5" />
                <span>move</span>
            </div>
        </div>
    </div>
</template>