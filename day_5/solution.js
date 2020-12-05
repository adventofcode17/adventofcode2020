"use strict";

const fs = require("fs");

// Sorted list of seat numbers
const seats = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(getSeat)
    .sort();

// console.log(seats);

function getIndex(s, topLetter) {
    // Return the string's decoded index e.g. getIndex("RRL", "R") returns 6 
    return s.split("").reduce((acc, letter, i) => {
        return acc + (letter === topLetter ? Math.pow(2, s.length - 1 - i) : 0);
    }, 0);
}

function getSeat(pass) {
    return (getIndex(pass.slice(0, 7), "B") * 8) + getIndex(pass.slice(7), "R");
}

function getEmptySeat() {
    return seats.find((seat, i) => seat === seats[i + 1] - 2) + 1;
}

// 855, 552
console.log(Math.max(...seats), getEmptySeat());
