"use strict";

const fs = require("fs");

let [minDeparture, ids] = fs.readFileSync("input.txt")
    .toString()
    .split("\n");

minDeparture = parseInt(minDeparture);

ids = ids.split(",")
    .map((id, index) => [parseInt(id), index])
    .filter(([id, _]) => !isNaN(id));

console.log(ids);

// What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus?
let minWait = null;
let answer = null;

ids.forEach(([id, _]) => {
    const wait = id - (minDeparture % id);
    if (!minWait || (wait < minWait)) {
        minWait = wait;
        answer = minWait * id;
    }
});

// Part 1 - 136
console.log(answer);


/* Use Chinese remainder theorem

"Whenever we have an unknown number, but we know its remainders when divided by a few coprime integers, we can find what that number is."

The ids in the given and example inputs are pairwise co-prime positive integers(!!)

https://en.wikipedia.org/wiki/Diophantine_equation#Chinese_remainder_theorem
https://en.wikipedia.org/wiki/Chinese_remainder_theorem
Good walkthrough of caluclation: https://www.omnicalculator.com/math/chinese-remainder
Supports enough inputs to calculate answer: https://www.dcode.fr/chinese-remainder

After trial/error with the simplest example 17,x,13,19 -> 3417,
work out the right boxes to put numbers into and a final subtraction at the end :)

Result: x=739320315996301

Inputs:
x=[index]mod[id]
x≡0mod13
x≡7mod37
x≡13mod401
x≡27mod17
x≡32mod19
x≡36mod23
x≡42mod29
x≡44mod613
x≡85mod41

Answer:
(13 *37 *401 *17 *19 *23 *29 * 613 * 41) - 739320315996301 = 305068317272992

Part 2 - 305068317272992
*/
