"use strict";

const fs = require("fs");

let [minDeparture, ids] = fs.readFileSync("input.txt")
    .toString()
    .split("\n");

minDeparture = parseInt(minDeparture);

ids = ids.split(",")
    .filter(id => id !== "x")
    .map(id => parseInt(id));

// What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus?
let minWait = null;
let answer = null;

ids.forEach(id => {
    const wait = id - (minDeparture % id);
    if (!minWait || (wait < minWait)) {
        minWait = wait;
        answer = minWait * id;
    }
});

// Part 1 - 136
console.log(answer);
