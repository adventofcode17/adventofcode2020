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
    pass = pass.replaceAll(/[FL]/g, "0").replaceAll(/[BR]/g, "1");

    return (parseInt(pass.slice(0, 7), 2) * 8) + parseInt(pass.slice(7), 2);
}

function getEmptySeat() {
    return seats.find((seat, i) => seat === seats[i + 1] - 2) + 1;
}

// 855, 552
console.log(Math.max(...seats), getEmptySeat());
