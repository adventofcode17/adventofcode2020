"use strict";

const fs = require("fs");

/* Examples:

nop +0
jmp +4
acc -99
*/
const re = /^(?<operation>[a-z]+) (?<value>[+-][0-9]+)$/;

const instructions = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(instruction => instruction.match(re).groups)
    .map(i => ({ "operation": i.operation, "value": parseInt(i.value) }));

// console.log(instructions)

function run(instructions) {
    // Run the given instructions until the program terminates, returning the current value in the accumulator and whether it terminated successfully.

    let accumulator = 0;
    let programCounter = 0;
    const instructionsRun = new Set();

    while (!instructionsRun.has(programCounter)) {
        instructionsRun.add(programCounter);

        if (programCounter == instructions.length) {
            // The program is supposed to terminate by attempting to execute an instruction immediately after the last instruction in the file.
            return [accumulator, true];
        } else if (programCounter < 0 || programCounter > instructions.length) {
            // Invalid instruction. Exiting.
            return [null, false];
        }

        const instruction = instructions[programCounter];

        switch (instruction.operation) {
            // acc increases or decreases a single global value called the accumulator by the value given in the argument. For example, acc +7 would increase the accumulator by 7. The accumulator starts at 0. After an acc instruction, the instruction immediately below it is executed next.
            case "acc":
                accumulator += instruction.value;
                programCounter++;
                break;

            // jmp jumps to a new instruction relative to itself. The next instruction to execute is found using the argument as an offset from the jmp instruction; for example, jmp +2 would skip the next instruction, jmp +1 would continue to the instruction immediately below it, and jmp -20 would cause the instruction 20 lines above to be executed next.
            case "jmp":
                programCounter += instruction.value;
                break;

            // nop stands for No OPeration - it does nothing. The instruction immediately below it is executed next.
            case "nop":
                programCounter++;
                break;

            default:
                throw new TypeError("Invalid operation: " + instruction.operation);
        }
    }

    return [accumulator, false];
}


// Part 1 - 1548
console.log(run(instructions)[0])

// Part 2 - 1375
// Loop through each instruction in turn, testing if the transformation yields a valid program that terminates
for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];

    if (instruction.operation === "acc") {
        continue;
    }

    instruction.operation = instruction.operation === "jmp" ? "nop" : "jmp";

    const [accumulator, terminatedOk] = run(instructions);
    if (terminatedOk) {
        console.log(accumulator);
        break;
    }

    instruction.operation = instruction.operation === "jmp" ? "nop" : "jmp";
}
