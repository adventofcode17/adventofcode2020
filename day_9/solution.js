"use strict";

const fs = require("fs");

const values = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(n => parseInt(n));

// console.log(values);

const windowSize = 25;

function valid(values, i) {
    // Return whether the value at position i is valid
    for (let j = 1; j <= windowSize; j++) {
        for (let k = j + 1; k <= windowSize; k++) {
            if (values[i] === values[i - j] + values[i - k]) {
                return true;
            }
        }
    }
    return false;
}

// Part 1 - 731031916
let invalidValue = null;

for (let i = windowSize; i < values.length; i++) {
    if (!valid(values, i)) {
        invalidValue = values[i];
        break;
    }
}
console.log(invalidValue);

// Part 2 - 93396727
for (let i = 0; i < values.length - 1; i++) {
    let sum = values[i], min = sum, max = sum;

    for (let j = i + 1; j < values.length; j++) {
        max = Math.max(max, values[j]);
        min = Math.min(min, values[j]);

        sum += values[j];
        if (sum > invalidValue) {
            break;
        } else if (sum === invalidValue) {
            console.log(min + max);
            return;
        }
    }
}
