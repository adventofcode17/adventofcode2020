"use strict";

const fs = require("fs");

let input = fs.readFileSync("input.txt")
    .toString()
    .split("\n\n");

input = parse(input);

// console.log(input);

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
        .reduce(function (acc, ruleText) {
            const [field, ranges] = parseRule(ruleText);
            acc[field] = ranges;
            return acc;
        }, {});

    // [103, 19, 278, ...]
    const ticket = input[1]
        .split("\n")[1]
        .split(",")
        .map(n => parseInt(n));

    // [ticket]
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
    // Return whether a value is valid for at least one of the given rule ranges
    for (const [min, max] of ranges) {
        if ((value >= min) && (value <= max)) {
            // Range matches
            return true;
        }
    }

    // No range matched
    return false;
}

function sumErrors(ticket, rules) {
    // Sum the values of the ticket if it has no valid values, otherwise return zero.
    return ticket
        .filter(value => Object.entries(rules).every(([_, ranges]) => !isValidValue(value, ranges)))
        .reduce((a, b) => a + b, 0);
}

function errorRate(tickets, rules) {
    return tickets.reduce((acc, ticket) => acc + sumErrors(ticket, rules), 0);
}

function isValidTicket(ticket, rules) {
    return ticket.every(value => Object.entries(rules).some(([_, ranges]) => isValidValue(value, ranges)));
}

function compare(possibleFields, validTickets, rules) {
    // Compare and filter (in place) the set of possible fields per ticket column with the given ticket ranges
    for (const ticket of validTickets) {
        for (let i = 0; i < ticket.length; i++) {
            for (const field of new Set(possibleFields[i])) {
                if (!isValidValue(ticket[i], rules[field])) {
                    possibleFields[i].delete(field);
                }
            }
        }
    }
}

function getAnyElement(s) {
    // Return a single value from set s
    return s.values().next().value;
}

function knownFields(possibleFields) {
    return possibleFields.filter(fields => fields.size == 1).map(getAnyElement);
}

function reduce(possibleFields) {
    // Reduce (in place) the set of possible fields to a single solution. Assumes the simple case that a single answer exists, otherwise will infinite loop
    // e.g. [[1, 2], [1, 2, 3], [1]] has the solution [2, 3, 1]

    while (knownFields(possibleFields).length != possibleFields.length) {
        possibleFields
            .filter(fields => fields.size > 1)
            .forEach(fields => {
                for (let field of knownFields(possibleFields)) {
                    fields.delete(field);
                }
            });
    }
}

function getFieldMappings(rules, ticket, nearbyTickets) {
    // Return the list of valid field mappings [fieldOne, fieldThree, ...] for the given input
    const validTickets = nearbyTickets.filter(ticket => isValidTicket(ticket, rules));

    // Set of all field names, {"fieldOne", "fieldTwo", ...}
    const fieldNames = new Set(Object.keys(rules));

    // Possible fields per ticket column, [{fieldOne}, {fieldOne, fieldThree}, ...]
    let possibleFields = [];
    for (let i = 0; i < ticket.length; i++) {
        possibleFields.push(new Set(fieldNames));
    }

    compare(possibleFields, validTickets, rules);
    reduce(possibleFields);
    return possibleFields.map(getAnyElement);
}

const fieldMappings = getFieldMappings(input["rules"], input["ticket"], input["nearbyTickets"]);

let answer = fieldMappings
    .reduce((acc, field, i) => field.startsWith("departure ") ? acc * input["ticket"][i] : acc, 1);

// 21980
console.log(errorRate(input["nearbyTickets"], input["rules"]));

// 1439429522627
console.log(answer);
