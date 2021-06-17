"use strict";

const fs = require("fs");

let numbers = fs.readFileSync("input.txt")
    .toString()
    .split(",")
    .map(n => parseInt(n));

console.log(numbers);

// {number: turn}
const lastSpoken = {[numbers[0]]: 0};

function play(numbers, turns) {
    let previous = numbers[0], next = null;

    for (let turn = 1; turn < turns; turn++) {
        if (turn < numbers.length) {
            // Players begin by taking turns reading from a list of starting numbers
            next = numbers[turn];
        } else {
            // Then, each turn consists of considering the most recently spoken number

            if (!(previous in lastSpoken)) {
                // If that was the first time the number has been spoken, the current player says 0.
                next = 0;
            } else {
                // Otherwise, the number had been spoken before; the current player announces how many turns apart the number is from when it was previously spoken
                next = turn - lastSpoken[previous] - 1;
            }
        }

        lastSpoken[previous] = turn - 1;
        previous = next;
    }

    return previous;
}

// 1009
console.log(play(numbers, 2020));
