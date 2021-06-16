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
        return { "type": "mask", "mask": m.groups.mask };
    }

    m = line.match(memRegex);
    if (m !== null) {
        // JavaScript objects only allow Strings as keys, so don't need to parse the address.
        return { "type": "memory", "address": m.groups.address, "value": parseInt(m.groups.value) };
    }

    throw new TypeError("Invalid input line:", line);
}

function apply(mask, value) {
    // A 0 or 1 overwrites the corresponding bit in the value, while an X leaves the bit in the value unchanged.
    const ones = parseInt(mask.replace(/X/g, '0'), 2);
    const zeros = parseInt(mask.replace(/X/g, '1'), 2);

    return (BigInt(value) | BigInt(ones)) & BigInt(zeros);
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) {
        throw new TypeError("Invalid string index", index);
    }
    return str.substring(0, index) + chr + str.substring(index + 1);
}

function executeRecursive(state, command, floatingMask) {
    const index = floatingMask.indexOf("Y");

    // Base case
    if (index === -1) {
        let address = BigInt(parseInt(state.mask.replace(/X/g, "0"), 2)) | BigInt(command.address);
        address = apply(floatingMask, address);

        state.memory[address] = command.value;
        return;
    }

    // Recursive case
    executeRecursive(state, command, setCharAt(floatingMask, index, "0"));
    executeRecursive(state, command, setCharAt(floatingMask, index, "1"));
}

function setMemory(state, command, version) {
    switch (version) {
        case 1:
            state.memory[command.address] = apply(state.mask, command.value);
            break;
        case 2:
            // Re-use part 1's mask logic to apply the floating bits, by setting all non-floating bits to X.
            const floatingMask = state.mask.replace(/X/g, 'Y').replace(/0|1/g, 'X');
            executeRecursive(state, command, floatingMask);
            break;
        default:
            throw new TypeError("Invalid version:", command.type);
    } 
}

function execute(state, command, version) {
    switch (command.type) {
        case "mask":
            state.mask = command.mask;
            break;
        case "memory":
            setMemory(state, command, version);
            break;
        default:
            throw new TypeError("Invalid command type:", command.type);
    }
}

function sumValues(obj) {
    // E.g. {"a": 1, "b": 2} returns 1 + 2 = 3
    return Object.values(obj).reduce((a, b) => a + b);
}

function run(commands, version) {
    const state = {
        "memory": {},  // {address: BigInt(value)}
        "mask": null,
    }

    commands.forEach(command => execute(state, command, version));
    console.log(Number(sumValues(state.memory)));
}

// 9967721333886
run(commands, 1);

// 4355897790573
run(commands, 2);
