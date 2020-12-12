"use strict";

const fs = require("fs");

// seats[row][column], op left is (0,0)
let seats = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(row => row.split(""));

// console.log(seats);

// [[dy, dx], ...] Clockwise, starting at the seat immediately above the seat (x, y)
const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

function inBounds(seats, row, column) {
    return row >= 0 && row < seats.length && column >= 0 && column <= seats[0].length;
}

function occupiedPartOne(seats, row, column) {
    // Return the total number of occupied adjacent seats
    let total = 0;

    for (let i = 0; i < directions.length; i++) {
        const [dy, dx] = directions[i];
        let r = row + dy, c = column + dx;

        if (inBounds(seats, r, c) && seats[r][c] === "#") {
            total++;
        }
    }
    return total;
}

function occupiedPartTwo(seats, row, column) {
    // Return the total number of occupied seats when looking outwards in each direction
    let total = 0;

    for (let i = 0; i < directions.length; i++) {
        const [dy, dx] = directions[i];
        let r = row + dy, c = column + dx;

        while (inBounds(seats, r, c) && !(seats[r][c] === "L")) {
            if (seats[r][c] === "#") {
                total++;
                break;
            }

            r += dy;
            c += dx;
        }
    }
    return total;
}

function nextState(seats, row, column, maxOccupied, countOccupied) {
    // Return the next value at the given position
    const state = seats[row][column];

    // Floor (.) never changes
    if (state === ".") {
        return state;
    }

    const occupied = countOccupied(seats, row, column)

    // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
    if ((state === "L") && (occupied === 0)) {
        return "#";
    }

    // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
    if ((state === "#") && (occupied >= maxOccupied)) {
        return "L";
    }

    // Otherwise, the seat's state does not change.
    return state;
}

function run(seats, maxOccupied, countOccupied) {
    let nextSeats = new Array(seats.length);
    let seatChanged = true;

    while (seatChanged) {
        seatChanged = false;

        for (let row = 0; row < seats.length; row++) {
            nextSeats[row] = new Array(seats[row].length);

            for (let column = 0; column < seats[row].length; column++) {
                nextSeats[row][column] = nextState(seats, row, column, maxOccupied, countOccupied);
                seatChanged = seatChanged || (seats[row][column] !== nextSeats[row][column]);
            }
        }

        seats = nextSeats;
        nextSeats = new Array(seats.length);
    }

    return seats;
}

function totalOccupied(seats) {
    // Return the total number of occupied seats
    let occupied = 0;

    for (let row = 0; row < seats.length; row++) {
        for (let column = 0; column < seats[row].length; column++) {
            if (seats[row][column] === "#") {
                occupied++;
            }
        }
    }
    return occupied;
}

// Part 1 - 2483
console.log(totalOccupied(run(seats, 4, occupiedPartOne)));

// Part 2 - 2285
console.log(totalOccupied(run(seats, 5, occupiedPartTwo)));
