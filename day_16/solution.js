"use strict";

const fs = require("fs");

let input = fs.readFileSync("input.txt")
    .toString()
    .split("\n\n");

input = parse(input);

console.log(input);

function parseRule(ruleText) {
    const rulesRegex = /^(?<field>[^:]+): (?<ranges>.*)$/;

    const m = ruleText.match(rulesRegex);
    if (m === null) {
        throw new TypeError("Invalid rule:", rule);
    }

    // [[minA, maxA], ...]
    const ranges = m.groups.ranges
        .split(" or ")
        .map(range => range
            .split("-")
            .map(n => parseInt(n)));

    return [m.groups.field, ranges];
}

function parse(input) {
    // {field: [range]}
    const rules = input[0]
        .split("\n")
        .reduce(function(acc, ruleText) {
            const [field, ranges] = parseRule(ruleText);
            acc[field] = ranges;
            return acc;
        }, {});

    const ticket = input[1]
        .split("\n")[1]
        .split(",")
        .map(n => parseInt(n));

    const nearbyTickets = input[2]
        .split("\n")
        .slice(1)
        .map(row => row
            .split(",")
            .map(n => parseInt(n)));

    return {
        "rules": rules,
        "ticket": ticket,
        "nearbyTickets": nearbyTickets
    };
}

function isValidValue(value, ranges) {
    // Return whether a value is valid for the given rule
    for (const [min, max] of ranges) {
        if ((value >= min) && (value <= max)) {
            // Found a range within the rule that matched
            return true;
        }
    }

    // No range matched
    return false;
}

function sumErrors(ticket, rules) {
    // Sum the values of any ticket which has no valid values, otherwise return zero.
    return ticket
        .filter(value => Object.entries(rules).every(([_, ranges]) => !isValidValue(value, ranges)))
        .reduce((a, b) => a + b, 0);
}

function errorRate(tickets) {
    return tickets.reduce((acc, ticket) => acc + sumErrors(ticket, input["rules"]), 0);
}

// 21980
console.log(errorRate(input["nearbyTickets"]));

// Part 2

function isValidTicket(ticket, rules) {
    return ticket.every(value => Object.entries(rules).some(([_, ranges]) => isValidValue(value, ranges)));
}


const validTickets = input["nearbyTickets"].filter(ticket => isValidTicket(ticket, input["rules"]))
console.log(validTickets)
console.log(input["nearbyTickets"].length, validTickets.length);

// Set of all field names, {"fieldOne", "fieldTwo", ...}
const fieldNames = new Set(Object.keys(input["rules"]));
console.log(fieldNames);

// Possible fields per ticket column, [{"fieldOne"}, {"fieldOne, fieldThree"}, ...]
let possibleFields = [];
for (let i = 0; i < input["ticket"].length; i++) {
    possibleFields.push(new Set(fieldNames));
}

for (const ticket of validTickets) {
    for (let i = 0; i < ticket.length; i++) {
        for (const field of new Set(possibleFields[i])) {
            // console.log(ticket, i, field, input["rules"][field]);

            if (!isValidValue(ticket[i], input["rules"][field])) {
                possibleFields[i].delete(field);
            }
        }
    }
}

// Now we have a reduced set of possible fields. Assume a single answer exists (or we'd infinite loop)
// e.g. [[1, 2, 3], [1, 2], [1]] has the solution [3, 2, 1]

// console.log(possibleFields);

// TODO: tidy
function knownFields(possibleFields) {
    const knownFields = new Set();
    for (const fields of possibleFields) {
        if (fields.size === 1) {
            knownFields.add(getAnyElement(fields))
        }
    }
    return knownFields;
}

let known = knownFields(possibleFields);

function getAnyElement(s) {
    return s.values().next().value;
}

let n = 0;
while (known.size != possibleFields.length) {
    // console.log(known)

    possibleFields
        .filter(fields => fields.size > 1)
        .forEach(fields => {
            for (let field of known) {
                // console.log(fields, known, field);
                fields.delete(field);
                // console.log(fields);
            }
        });

    // console.log(possibleFields);
    known = knownFields(possibleFields);
    
    n++
    if (n > 25) {
        console.log(possibleFields);
        console.log(n);
        break;
    }
}

console.log(possibleFields);

let answer = 1;
for (let i = 0; i < possibleFields.length; i++) {
    if (getAnyElement(possibleFields[i]).startsWith("departure ")) {
        answer = answer * input["ticket"][i];
    }
}

// 1439429522627
console.log(answer);
