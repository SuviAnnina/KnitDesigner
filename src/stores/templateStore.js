import { ref } from "vue";

export const templates = [
    {
        size: "XS",
        skipRows: [0, 4, 11, 15, 30, 34, 49],
    },
    {
        size: "S",
        skipRows: [4, 11, 15, 30, 34, 49],
    },
    {
        size: "M",
        skipRows: [4, 11, 15, 30, 34],
    },
    {
        size: "L",
        skipRows: [4, 15, 34],
    },
    {
        size: "XL",
        skipRows: [15, 34],
    },
    {
        size: "XXL",
        skipRows: [],
    }
];

export function getTemplate(size) {
    return templates.find(template => template.size === size) || null;
}

export const selectedTemplate = ref(getTemplate("S"));

export function setSelectedTemplate(size) {
    selectedTemplate.value = getTemplate(size);
}