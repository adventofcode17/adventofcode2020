"use strict";

const fs = require("fs");

// [[action, value], ...]
let instructions = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(line => line.match(/^(?<action>[A-Z])(?<value>[0-9]+)$/).groups)
    .map(i => [i.action, parseInt(i.value)]);

// console.log(instructions);

// Clockwise from North
const directions = ["N", "E", "S", "W"];

// {action: [dy, dx]) clockwise from North
const compass = {
    "N": [-1, 0],
    "E": [0, 1],
    "S": [1, 0],
    "W": [0, -1]
};

function travel(instructions) {
    // Follow the given instructions, returning the final position
    let x = 0, y = 0;

    // The ship starts by facing east.
    let direction = 1;

    let n = 0;
    instructions.forEach(([action, value]) => {
        //console.log("\n", action, value);

        let dy = 0, dx = 0;

        switch (action) {
            case "N":
            case "S":
            case "E":
            case "W":
                [dy, dx] = compass[action];
                x += dx * value;
                y += dy * value;
                break;
            case "L":
                value = value / 90;
                direction = (direction + directions.length - value) % directions.length
                break;
            case "R":
                value = value / 90;
                direction = (direction + value) % directions.length
                break;
            case "F":
                [dy, dx] = compass[directions[direction]];
                x += dx * value;
                y += dy * value;
                break
            default:
                throw new TypeError("Invalid action: " + action);
        }

        //console.log(x, y);
    });

    return [x, y];
};

function manhattanDistance(x, y) {
    return Math.abs(x) + Math.abs(y)
}

// Part 1 - 1424
let [x, y] = travel(instructions);
console.log(manhattanDistance(x, y));
