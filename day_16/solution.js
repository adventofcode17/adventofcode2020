"use strict";

const fs = require("fs");

let input = fs.readFileSync("input.txt")
    .toString()
    .split("\n\n");

input = parse(input);

// console.log(input);

function parseRule(rule) {
    const rulesRegex = /^(?<field>[^:]+): (?<ranges>.*)$/;

    let m = rule.match(rulesRegex);
    if (m === null) {
        throw new TypeError("Invalid rule:", rule);
    }

    let ranges = m.groups.ranges
        .split(" or ")
        .map(range => range
            .split("-")
            .map(n => parseInt(n)));

    return {
        "field": m.groups.field,
        "ranges": ranges
    };
}

function parse(input) {
    const rules = input[0]
        .split("\n")
        .map(parseRule);

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

function isValid(value, rules) {
    for (const rule of rules) {
        for (const [min, max] of rule["ranges"]) {
            if ((value >= min) && (value <= max)) {
                // Found a rule which matches the value
                return true;
            }
        }
    };

    // No rules matched the value
    return false;
}

function sumErrors(ticket, rules) {
    // Return the error rate for the ticket
    const invalidValues = ticket.filter(value => !isValid(value, rules));
    return invalidValues.reduce((a, b) => a + b, 0);
}

let errorRate = input["nearbyTickets"]
    .reduce((acc, ticket) => acc + sumErrors(ticket, input["rules"]), 0);

// 21980
console.log(errorRate);
