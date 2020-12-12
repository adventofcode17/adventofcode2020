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

    instructions.forEach(([action, value]) => {
        let dy, dx;

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
                direction = (direction + directions.length - value / 90) % directions.length;
                break;
            case "R":
                direction = (direction + value / 90) % directions.length;
                break;
            case "F":
                [dy, dx] = compass[directions[direction]];
                x += dx * value;
                y += dy * value;
                break;
            default:
                throw new TypeError("Invalid action: " + action);
        }
    });

    return [x, y];
}

function travelWaypoint(instructions) {
    // Follow the given waypoint instructions, returning the final position

    // The waypoint location is relative to the ship
    let waypointX = 10, waypointY = -1;
    let x = 0, y = 0;

    instructions.forEach(([action, value]) => {
        switch (action) {
            case "N":
            case "S":
            case "E":
            case "W":
                // Move the waypoint in the direction by the given value.
                let [dy, dx] = compass[action];
                waypointX += dx * value;
                waypointY += dy * value;
                break;
            case "L":
                // Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
                for (let i = 0; i < (value / 90) % 4; i++) {
                    [waypointX, waypointY] = [waypointY, -waypointX];
                }
                break;
            case "R":
                // Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
                for (let i = 0; i < (value / 90) % 4; i++) {
                    [waypointX, waypointY] = [-waypointY, waypointX];
                }
                break;
            case "F":
                // Action F means to move forward to the waypoint a number of times equal to the given value.
                x += waypointX * value;
                y += waypointY * value;
                break;
            default:
                throw new TypeError("Invalid action: " + action);
        }
    });

    return [x, y];
}

function manhattanDistance([x, y]) {
    return Math.abs(x) + Math.abs(y);
}

// Part 1 - 1424
console.log(manhattanDistance(travel(instructions)));

// Part 2 - 63447
console.log(manhattanDistance(travelWaypoint(instructions)));
