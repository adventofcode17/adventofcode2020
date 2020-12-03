"use strict";

const fs = require("fs");

const numbers = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(Number);

//console.log(numbers);

function part_1() {
    for (const n1 of numbers) {
        for (const n2 of numbers) {
            if ((n1 + n2) === 2020) {
                // 955584
                return n1 * n2;
            }
        }
    }

    return null;
}

function part_2() {
    for (const n1 of numbers) {
        for (const n2 of numbers) {
            for (const n3 of numbers) {
                if ((n1 + n2 + n3) === 2020) {
                    // 287503934
                    return n1 * n2 * n3;
                }
            }
        }
    }
}

console.log(part_1(), part_2());
