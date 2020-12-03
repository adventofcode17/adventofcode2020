"use strict";

const fs = require("fs");

// grid[y][x], top left is (0,0)
const grid = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(line => line.split(""));

// console.log(grid)

function countTrees(slope) {
    // Return the number of trees encountered on slope (dx, dy)
    let x = 0, y = 0, trees = 0;

    while (y <= grid.length - 1) {
        if (grid[y][x] === "#") {
            trees++;
        }
        y += slope[1];
        x = (x + slope[0]) % grid[0].length;
    }
    return trees;
}

// Count all the trees you would encounter for the slope right 3, down 1
// 270
console.log(countTrees([3, 1]))

// What do you get if you multiply together the number of trees encountered on each of the listed slopes?
// 2122848000
const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]] // [(dx, dy)]
const result = slopes.reduce((acc, slope) => acc * countTrees(slope), 1)
console.log(result)
