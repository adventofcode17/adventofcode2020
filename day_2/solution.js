"use strict";

const { strict } = require("assert");
const fs = require("fs");

/* Examples:

1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
*/
const re = /^(?<n1>[0-9]+)-(?<n2>[0-9]+) (?<letter>[a-z]): (?<password>[a-z]+)$/;

const inputs = fs.readFileSync("input.txt")
	            .toString()
                .split("\n")
                .map(line => line.match(re).groups);

//console.log(inputs)

const part1 = inputs.map(input => {
    const occurences = input.password.split(input.letter).length - 1;

    // The password policy indicates the lowest and highest number of times a given letter must appear for the password to be valid. For example, 1-3 a means that the password must contain a at least 1 time and at most 3 times.
    return (input.n1 <= occurences) && (occurences <= input.n2);
})
.filter(Boolean)
.length;

const part2 = inputs.map(input => {
    const l1 = input.password.charAt(input.n1 - 1);
    const l2 = input.password.charAt(input.n2 - 1);

    // Each policy actually describes two positions in the password, where 1 means the first character, 2 means the second character, and so on. (Be careful; Toboggan Corporate Policies have no concept of "index zero"!) Exactly one of these positions must contain the given letter. Other occurrences of the letter are irrelevant for the purposes of policy enforcement.
    return (l1 === input.letter || l2 === input.letter) && !(l1 === input.letter && l2 === input.letter);
})
.filter(Boolean)
.length;

// 445, 491
console.log(part1, part2);
