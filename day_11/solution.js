"use strict";

const fs = require("fs");

// seats[row][column], top left is (0,0)
let seats = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(row => row.split(""));

// console.log(seats);

function inBounds(seats, row, column) {
    return row >= 0 && row < seats.length && column >= 0 && column <= seats[0].length;
}

function seatsOccupied(seats, row, column) {
    // Return the number of occupied adjacent seats

    // dy, dx (clockwise, starting at the seat immediately above)
    const diffs = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

    const occupied = diffs.map(([dx, dy]) => {
        const r = row + dx, c = column + dy;
        return inBounds(seats, r, c) && seats[r][c] === "#";
    })

    return occupied
        .filter(Boolean)
        .length;
}

function nextState(seats, row, column) {
    // Return the next value at the given position
    const state = seats[row][column];

    // Floor (.) never changes
    if (state === ".") {
        return state;
    }

    const adjacentOccupied = seatsOccupied(seats, row, column)

    // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
    if ((state === "L") && (adjacentOccupied === 0)) {
        return "#";
    }

    // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
    if ((state === "#") && (adjacentOccupied >= 4)) {
        return "L";
    }

    // Otherwise, the seat's state does not change.
    return state;
}

function occupiedSeats(seats) {
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

let nextSeats = new Array(seats.length);
let seatChanged = true;

while (seatChanged) {
    seatChanged = false;

    for (let row = 0; row < seats.length; row++) {
        nextSeats[row] = new Array(seats[row].length);

        for (let column = 0; column < seats[row].length; column++) {
            nextSeats[row][column] = nextState(seats, row, column);
            seatChanged = seatChanged || (seats[row][column] !== nextSeats[row][column]);
        }
    }

    seats = nextSeats;
    nextSeats = new Array(seats.length);
}

// part 1 - 2483
console.log(occupiedSeats(seats));
