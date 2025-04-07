import { ref } from "vue";

export const fillerTexture = ref(null);
export const filledYokeTexture = ref(null);

export function setFillerTexture(newTexture) {
    fillerTexture.value = newTexture;
}

export function setFilledYokeTexture(newTexture) {
    filledYokeTexture.value = newTexture;
}