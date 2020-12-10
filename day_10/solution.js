"use strict";

const fs = require("fs");

const adapters = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(n => parseInt(n));

console.log(adapters);

// Add start outlet
adapters.push(0);

// The only possible arrangement using all the adapters ascending order
adapters.sort((a, b) => a - b);

// Add end device
adapters.push(adapters[adapters.length - 1] + 3);

let skipOne = 0, skipThree = 0;
for (let i = 0; i < adapters.length - 1; i++) {
    if (adapters[i+1] - adapters[i] === 1) {
        skipOne++;
    } else if (adapters[i+1] - adapters[i] === 3) {
        skipThree++;
    }
}

// Part 1 - 2346
console.log(skipOne, skipThree, skipOne * skipThree)
