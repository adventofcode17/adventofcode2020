"use strict";

const fs = require("fs");

// [{"byr":"1920", "iyr":"2010", ...}, ...]
const passports = fs.readFileSync("input.txt")
    .toString()
    .split("\n\n")
    .map(fields => new Map(fields.split(/ |\n/).map(field => field.split(":"))));

// console.log(passports);

const requiredFields = {
    "byr": /^19[2-9][0-9]|200[0-2]$/,           // (Birth Year) - four digits; at least 1920 and at most 2002.
    "iyr": /^20(?:1[0-9]|20)$/,                 // (Issue Year) - four digits; at least 2010 and at most 2020.
    "eyr": /^20(?:2[0-9]|30)$/,                 // (Expiration Year) - four digits; at least 2020 and at most 2030.

    // (Height) - a number followed by either cm or in:
    //   If cm, the number must be at least 150 and at most 193.
    //   If in, the number must be at least 59 and at most 76.
    "hgt": /^1(?:[5-8][0-9]|9[0-3])cm|(?:59|6[0-9]|7[0-6])in$/,

    "hcl": /^#[0-9a-f]{6}$/,                    // (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    "ecl": /^(?:amb|blu|brn|gry|grn|hzl|oth)$/, // (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    "pid": /^[0-9]{9}$/,                        // (Passport ID) - a nine-digit number, including leading zeroes.
    //"cid": null                               // (Country ID) - ignored, missing or not.
};

function hasRequiredFields(passport) {
    return Object.keys(requiredFields).every(field => passport.has(field));
}

function isValid(passport) {
    for (let [field, regex] of Object.entries(requiredFields)) {
        if (!regex.test(passport.get(field))) {
            return false;
        }
    }
    return true;
}

const part1 = passports.map(passport => hasRequiredFields(passport))
    .filter(Boolean)
    .length;

const part2 = passports.map(passport => isValid(passport))
    .filter(Boolean)
    .length;

// 254, 184
console.log(part1, part2);
