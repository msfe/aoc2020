import readline = require('readline')
import fs = require('fs');


const isPassport = (input: string): boolean => {
    return input.includes('hcl') && input.includes('iyr') && input.includes('eyr') && input.includes('ecl') && input.includes('pid') && input.includes('byr') && input.includes('hgt');
}

const getValueOfId = (id: string, input: string): string => {
    const startOfId = input.search(id + ":");
    return input.slice(startOfId + id.length + 1).split(' ')[0].split('\n')[0].trim();
}

const isValidHgt = (hgt: string): boolean => {
    const letters = hgt.slice(hgt.length - 2);
    if (letters == "cm") {
        const height = Number(hgt.slice(0, hgt.length - 2));
        if (height <= 193 && height >= 150) {
            return true;
        }
    }
    if (letters == "in") {
        const height = Number(hgt.slice(0, hgt.length - 2));
        if (height <= 76 && height >= 59) {
            return true;
        }
    }
    return false;
}

const validatePassport = (input: string): boolean => {
    if (!isPassport(input)) {
        return false;
    }
    const byr = Number(getValueOfId('byr', input));
    const iyr = Number(getValueOfId('iyr', input));
    const eyr = Number(getValueOfId('eyr', input));
    const hgt = getValueOfId('hgt', input);
    const hcl = getValueOfId('hcl', input);
    const ecl = getValueOfId('ecl', input);
    const pid = getValueOfId('pid', input);





    if (byr > 2002 || byr < 1920) {
        return false;
    }
    if (iyr > 2020 || iyr < 2010) {
        return false;
    }
    if (eyr > 2030 || eyr < 2020) {
        return false;
    }
    if (!isValidHgt(hgt)) {
        return false;
    }
    if (!hcl.match('#[a-f0-9]{6}')) {
        return false;
    }
    if (!["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(ecl)) {
        return false;
    }
    if (!pid.match('^[0-9]{9}$')) {
        return false;
    }
    return true;
}

function readNumberInput(filename: string): string {
    return fs.readFileSync(filename).toString();
}


function main() {
    const input: string[] = readNumberInput('input4').split(/\n\r/g);
    console.log(`Answer 1: ${input.filter(passport => isPassport(passport)).length}`);
    console.log(`Answer 2: ${input.filter(passport => validatePassport(passport)).length}`);
}

main();

