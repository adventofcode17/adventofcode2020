"use strict";

const fs = require("fs");

// {"blue": [[1, "green"], [2, "yellow"], ...], [...], ...}
let rules = new Map(fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(rule => rule.split(" bags contain "))
    .map(([colour, innerBags]) => [colour, parse(innerBags)])
);

function parse(innerBags) {
    if (innerBags === "no other bags.") {
        return [];
    }

    const re = /^(?<count>[0-9]+) (?<colour>.+) bags?\.?$/;

    return innerBags
        .split(", ")
        .map(bag => bag.match(re).groups)
        .map(bag => [parseInt(bag.count), bag.colour]);
}

// console.log(rules);

// Set of all bag colours that can hold a gold bag
const goldBags = new Set();
let size = -1;

// Iteratively add colours to the list of bags that can contain gold
// until we can add no more.
while (goldBags.size !== size) {
    size = goldBags.size;

    rules.forEach((innerBags, colour) => {
        if (goldBags.has(colour)) {
            // Already confirmed this bag can contain gold
            return;
        }

        const goldInnerBags = innerBags.some(([_, innerColour]) => {
            return innerColour === "shiny gold" || goldBags.has(innerColour);
        })

        if (goldInnerBags) {
            goldBags.add(colour);
        }
    });
}

function countBags(colour) {
    const childBags = rules.get(colour);

    // Base case
    if (childBags.length == 0) {
        return 1;
    }

    // Recursive case
    const totalChildBags = childBags.reduce((acc, [count, colour]) => acc + (count * countBags(colour)), 0);
    return totalChildBags + 1;
}

// 139, 58175
console.log(size, countBags("shiny gold") - 1);
