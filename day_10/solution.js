"use strict";

const fs = require("fs");

let adapters = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(n => parseInt(n));

console.log(adapters);

// Add start outlet
adapters.push(0);

// The only possible arrangement using all the adapters ascending order
adapters.sort((a, b) => a - b);

// Add end device
adapters.push(adapters[adapters.length - 1] + 3);

console.log(adapters);

let skipOne = 0, skipThree = 0;
for (let i = 0; i < adapters.length - 1; i++) {
    if (adapters[i + 1] - adapters[i] === 1) {
        skipOne++;
    } else if (adapters[i + 1] - adapters[i] === 3) {
        skipThree++;
    }
}

// Part 1 - 2346
console.log(skipOne * skipThree)

function arraysEqual(a, b) {
    // Copied from StackOverflow
    if (a === b) {
        return true
    };

    if (a == null || b == null) {
        return false
    };

    if (a.length !== b.length) {
        return false
    };

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

// Part 2 - 6044831973376
// TODO use a more elegant solution :)

// Idea: where there's a gap of three we can compute the total number of combinations each side of
//       the gap separately then multiply the results for both sides together. We Don't need to cut
//       the given input (about 102 lines) by much, since the example input with 31 rows runs OK without
//       this optimisation.
// For example total([1, 2, 4, 7, 8, 9, 10]) == total([1, 2, 4, 7]) * total([7, 8, 9, 10])
let total = 1;

for (let i = 0; i < adapters.length - 1; i++) {
    if (((adapters[i + 1] - adapters[i]) === 3) || (i === adapters.length - 1)) {
        // Found a split
        const firstHalf = adapters.slice(0, i + 1);
        const unique = countUniqueChains(firstHalf);
        total = total * unique;

        adapters = adapters.slice(i);
        i = 0;
    }
}

console.log(total);

function countUniqueChains(adapters) {
    let total = 1;
    let chains = [adapters];
    let nextChains = [];

    // Prevent counting a combination twice due to removing the same elements in alternate orders
    let nextChainHashes = new Set();

    // Start from the longest possible chain, and produce new valid chains by removing
    // one adapter at a time.
    while (chains.length > 0) {
        while (chains.length > 0) {
            let chain = chains.pop();

            for (let i = 1; i < chain.length; i++) {
                const diff = chain[i + 1] - chain[i - 1];

                // Test if removing adapter at position i is valid
                if (diff <= 3) {
                    const newChain = chain.slice(0, i).concat(chain.slice(i + 1));
                    const newChainHash = newChain.join(",");  // Not the most elegant solution

                    if (!nextChainHashes.has(newChainHash)) {
                        nextChainHashes.add(newChainHash);

                        nextChains.push(newChain);
                        total++;
                    }
                }
            }
        }

        nextChainHashes = new Set();
        chains = nextChains;
        nextChains = [];
    }

    return total
}

