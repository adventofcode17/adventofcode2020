"use strict";

const fs = require("fs");

const groups = fs.readFileSync("input.txt")
    .toString()
    .split("\n\n")
    .map(group => group.split("\n").map(form => new Set(form)));

// console.log(groups)

function intersection(s1, s2) {
    return new Set([...s1, ...s2]);
}

function union(s1, s2) {
    return new Set([...s1].filter(x => s2.has(x)));
}

const part1 = groups
    .map(group => group.reduce((allAnswers, form) => intersection(allAnswers, form), new Set()))
    .map(group => group.size)
    .reduce((total, size) => total + size);

const part2 = groups
    .map(group => group.reduce((mutualAnswers, form) => union(mutualAnswers, form), group[0]))
    .map(group => group.size)
    .reduce((total, size) => total + size);

// 6551, 3358
console.log(part1, part2);
