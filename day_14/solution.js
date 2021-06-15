"use strict";

const fs = require("fs");

let commands = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(parse);

function parse(line) {
    const maskRegex = /^mask = (?<mask>[X01]+)$/;
    const memRegex = /^mem\[(?<address>[0-9]+)\] = (?<value>[0-9]+)$/;

    let m = line.match(maskRegex);
    if (m !== null) {
        const onesOr = parseInt(m.groups.mask.replace(/X/g, '0'), 2);
        const zerosAnd = parseInt(m.groups.mask.replace(/X/g, '1'), 2);

        return {"type": "mask", "ones": onesOr, "zeros": zerosAnd};
    }

    m = line.match(memRegex);
    if (m !== null) {
        // JavaScript objects only allow Strings as keys, so don't need to parse the address
        return {"type": "memory", "address": m.groups.address, "value": parseInt(m.groups.value)};
    }

    throw new TypeError("Invalid input line: " + line);
}

console.log(commands);

function apply([ones, zeros], value) {
    const result = (value | ones) & zeros;
    console.log(ones, zeros, value, result);
    return (BigInt(value) | BigInt(ones)) & BigInt(zeros);
}

function sumValues(obj) {
    return Object.values(obj).reduce((a, b) => a + b);
}

function run(commands) {
    // {address: BigInt(value)}
    const memory = {};

    // [ones, zeros]
    let currentMask = [null, null];

    commands.forEach(command => {
        switch (command.type) {
            case "mask":
                currentMask = [command.ones, command.zeros];
                break;
            case "memory":
                memory[command.address] = apply(currentMask, command.value);
                break;
            default:
                throw new TypeError("Invalid command type: " + command.type);
        }
    });

    console.log(memory);
    console.log(Number(sumValues(memory)));
}

// 9967721333886
run(commands);
