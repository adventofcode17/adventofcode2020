"use strict";

const fs = require("fs");

let commands = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(parse);

// console.log(commands);

function parse(line) {
    const maskRegex = /^mask = (?<mask>[X01]+)$/;
    const memRegex = /^mem\[(?<address>[0-9]+)\] = (?<value>[0-9]+)$/;

    let m = line.match(maskRegex);
    if (m !== null) {
        return {"type": "mask", "mask": m.groups.mask};
    }

    m = line.match(memRegex);
    if (m !== null) {
        // JavaScript objects only allow Strings as keys, so don't need to parse the address
        return {"type": "memory", "address": m.groups.address, "value": parseInt(m.groups.value)};
    }

    throw new TypeError("Invalid input line: " + line);
}

function apply(mask, value) {
    const ones = parseInt(mask.replace(/X/g, '0'), 2);
    const zeros = parseInt(mask.replace(/X/g, '1'), 2);

    return (BigInt(value) | BigInt(ones)) & BigInt(zeros);
}

function sumValues(obj) {
    return Object.values(obj).reduce((a, b) => a + b);
}

function executeV1(state, command) {
    switch (command.type) {
        case "mask":
            state.mask = command.mask;
            break;
        case "memory":
            state.memory[command.address] = apply(state.mask, command.value);
            break;
        default:
            throw new TypeError("Invalid command type: " + command.type);
    }
}

function runV1(commands) {
    const state = {
        "memory": {},  // {address: BigInt(value)}
        "mask": null
    }

    commands.forEach(command => executeV1(state, command));

    console.log(Number(sumValues(state.memory)));
}

function setCharAt(str,index,chr) {
    if (index > str.length-1) {
        return str;
    }
    return str.substring(0,index) + chr + str.substring(index+1);
}

function executeV2Recursive(state, command, floatingMask) {
    const index = floatingMask.indexOf("Y");

    // Base case
    if (index === -1) {
        let address = BigInt(parseInt(state.mask.replace(/X/g, "0"), 2)) | BigInt(command.address);
        address = apply(floatingMask, address);

        state.memory[address] = command.value;
        return;
    }

    // Recursive case
    executeV2Recursive(state, command, setCharAt(floatingMask, index, "0"));
    executeV2Recursive(state, command, setCharAt(floatingMask, index, "1"));
}

function executeV2(state, command) {
    switch (command.type) {
        case "mask":
            state.mask = command.mask;
            break;
        case "memory":
            const floatingMask = state.mask.replace(/X/g, 'Y').replace(/0|1/g, 'X');
            executeV2Recursive(state, command, floatingMask);
            break;
        default:
            throw new TypeError("Invalid command type: " + command.type);
    }

}

function runV2(commands) {
    const state = {
        "memory": {},  // {address: BigInt(value)}
        "mask": null,
    }

    commands.forEach(command => executeV2(state, command));

    console.log(Number(sumValues(state.memory)));
}

// 9967721333886
runV1(commands);

// 4355897790573
runV2(commands);
