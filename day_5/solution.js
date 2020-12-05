"use strict";

const fs = require("fs");

// Sorted list of seat numbers
const seats = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(getSeat)
    .sort();

// console.log(seats);

function getSeat(pass) {
    return parseInt(pass.replaceAll(/[FL]/g, "0").replaceAll(/[BR]/g, "1"), 2);
}

function getEmptySeat() {
    return seats.find((seat, i) => seat === seats[i + 1] - 2) + 1;
}

// 855, 552
console.log(Math.max(...seats), getEmptySeat());
