"use strict";

const fs = require("fs");

const re = /^(?<operation>[a-z]+) (?<value>[+-][0-9]+)$/;

// {"blue": [[1, "green"], [2, "yellow"], ...], "red": [...], ...}
let instructions = fs.readFileSync("input.txt")
    .toString()
    .split("\n")
    .map(instruction => instruction.match(re).groups)
    .map(i => ({"operation": i.operation, "value": parseInt(i.value)}));

console.log(instructions)


function run(instructions) {
    // Run the given instructions until a loop is reached or an out-of-bounds instruction
    // is attempted to be run.

    let accumulator = 0;
    let programCounter = 0;
    const instructionsRun = new Set();
    
    while (!instructionsRun.has(programCounter)) {
        instructionsRun.add(programCounter);
    
        const instruction = instructions[programCounter];
    
        // console.log(programCounter, accumulator, instruction)
    
        switch(instruction.operation) {
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
                console.log("Invalid operation. Exiting.");
                return;
        }
    }

    return accumulator;
}


// 1548
console.log(run(instructions))

//console.log(part1, part2);
