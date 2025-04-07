import { selectedTemplate } from "./templateStore";
import { reactive } from "vue";

export const grid = reactive([
    [0, 0, 3, 4, 5, 0, 0, 0], // 0: skip XS
    [0, 0, 3, 4, 5, 0, 0, 0],
    [0, 0, 3, 4, 5, 0, 0, 0],

    [0, 0, 3, 4, 5, 6, 0, 0],
    [0, 0, 3, 4, 5, 6, 0, 0], // 4: skip XS, S, M, L
    [0, 0, 3, 4, 5, 6, 0, 0],
    [0, 0, 3, 4, 5, 6, 0, 0],
    [0, 0, 3, 4, 5, 6, 0, 0],

    [0, 2, 3, 4, 5, 6, 0, 0],
    [0, 2, 3, 4, 5, 6, 0, 0],
    [0, 2, 3, 4, 5, 6, 0, 0],
    [0, 2, 3, 4, 5, 6, 0, 0], // 11: skip XS, S, M
    [0, 2, 3, 4, 5, 6, 0, 0],
    [0, 2, 3, 4, 5, 6, 0, 0],

    [0, 2, 3, 4, 5, 6, 7, 0],
    [0, 2, 3, 4, 5, 6, 7, 0], // 15: skip XS, S, M, L, XL
    [0, 2, 3, 4, 5, 6, 7, 0],
    [0, 2, 3, 4, 5, 6, 7, 0],
    [0, 2, 3, 4, 5, 6, 7, 0],
    [0, 2, 3, 4, 5, 6, 7, 0],
    [0, 2, 3, 4, 5, 6, 7, 0],
    [0, 2, 3, 4, 5, 6, 7, 0],
    [0, 2, 3, 4, 5, 6, 7, 0],
    [0, 2, 3, 4, 5, 6, 7, 0],

    [1, 2, 3, 4, 5, 6, 7, 0],
    [1, 2, 3, 4, 5, 6, 7, 0],
    [1, 2, 3, 4, 5, 6, 7, 0],
    [1, 2, 3, 4, 5, 6, 7, 0],
    [1, 2, 3, 4, 5, 6, 7, 0],
    [1, 2, 3, 4, 5, 6, 7, 0],
    [1, 2, 3, 4, 5, 6, 7, 0], // 30: skip XS, S, M
    [1, 2, 3, 4, 5, 6, 7, 0],

    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8], // 34: skip: XS, S, M, L, XL
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8], // 49: skip XS, S
])

export const clearGrid = () => {
    grid.forEach((row, rowIndex) => {
        grid[rowIndex] = row.map(value => value === 0 ? 0 : 1);
    });
};

export const setGridValue = (x, y, value) => {
    const row = getRow(y)
    row[x] = value;
}

export const getGridLength = () => {
    return grid.length - selectedTemplate.value.skipRows.length;
}

export const getRow = (index) => {
    // TODO: Check for out of bounds index, consider skippedRows
    if (selectedTemplate.value.size === "XXL") {
        return grid[index];
    }

    // find how many rows have been skipped
    const skippedIndices = selectedTemplate.value.skipRows.map((v, i) => v - i);
    let sortedIndex = skippedIndices.findIndex(v => v >= index);

    if (sortedIndex === -1) {
        sortedIndex = selectedTemplate.value.skipRows.length;
    }
    if (skippedIndices.includes(index)) {
        sortedIndex += 1;
    }
    return grid[index + sortedIndex];
}

export const getRowLength = (index) => {
    return 8 - getRow(index).filter(num => num === 0).length;
}