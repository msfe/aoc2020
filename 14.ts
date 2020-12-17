import path = require('path');
import fs = require('fs');


/**
 * Index accessors
 */
var Hi = 0;
var Lo = 1;


/**
 * Pad string
 */
var zeros = '';

for (var i = 0; i < 32; i = (i + 1) | 0) {
    zeros += '0';
}

/**
 * Divides hi and lo
 */
const divide = (bit: number): number[] => {
    var bitString = ((zeros + zeros) + (Number(bit).toString(2))).slice(-64);

    return [
        parseInt(bitString.slice(0, 32), 2), // hi
        parseInt(bitString.slice(-32), 2) // lo
    ];
}

/**
 * Pads 32bit binary number with 0
 */
function pad(bit: number) {
    return (zeros + (bit.toString(2))).slice(-32);
}

const and = (a: number, b: number): number => {
    var _a = divide(a);
    var _b = divide(b);

    return parseInt(pad((_a[Hi] & _b[Hi]) >>> 0) + pad((_a[Lo] & _b[Lo]) >>> 0), 2);
}
const or = (a: number, b: number): number => {
    var _a = divide(a);
    var _b = divide(b);

    return parseInt(pad((_a[Hi] | _b[Hi]) >>> 0) + pad((_a[Lo] | _b[Lo]) >>> 0), 2);
}

//----------------
// Thanks to https://github.com/pocka/bitwise64/blob/master/index.js for providing the functions above
//----------------

interface mask {
    ones: number,
    zeroes: number,
}

const getMask = (mask: string): mask => {
    const onesValue = Number("0b" + mask.replace(/X/g, "0"))
    const zeroesValue = Number("0b" + mask.replace(/X/g, "1"))
    return { ones: onesValue, zeroes: zeroesValue };
}

const getAnswer = (memory: { [id: number]: number; }): number => {
    return Number(Object.entries(memory).reduce((acc, [_, value]) => acc += value, 0))
}

const maskValue = (value: number, mask: mask): number => {
    return or(and(value, mask.zeroes), mask.ones)
}

const buildMemoryIndexes = (current: string[], mask: string, maskedMemoryIndex: string, index: number): string[] => {
    if (index == mask.length)
        return current
    if (mask.charAt(index) != 'X') {
        return buildMemoryIndexes(current.map(str => maskedMemoryIndex.charAt(index) + str), mask, maskedMemoryIndex, index + 1);
    } else {
        return buildMemoryIndexes(current.map(str => "0" + str), mask, maskedMemoryIndex, index + 1)
            .concat(buildMemoryIndexes(current.map(str => "1" + str), mask, maskedMemoryIndex, index + 1));
    }
}

const getMemoryIndexes = (initialMemoryIndex: number, mask: string): number[] => {
    const initMask = getMask(mask);
    const maskedMemoryIndexUnkownLength = or(initialMemoryIndex, initMask.ones).toString(2);
    const maskedMemoryIndex = "0".repeat(36 - maskedMemoryIndexUnkownLength.length) + maskedMemoryIndexUnkownLength;
    return buildMemoryIndexes([""], mask, maskedMemoryIndex, 0).map(str => Number("0b" + str));
}

const process1 = (input: string[]): number => {
    const memory: { [id: number]: number; } = {};
    let mask = { ones: 0, zeroes: 0 };
    input.map(operation => {
        const element = operation.split(' = ');
        const operationType = element[0];
        if (operationType == "mask") {
            mask = getMask(element[1])
        } else {
            const memoryIndex = Number(operation.split('[')[1].split(']')[0])
            memory[memoryIndex] = maskValue(Number(element[1]), mask);
        }
    });
    return getAnswer(memory);
}

const process2 = (input: string[]): number => {
    const memory: { [id: number]: number; } = {};
    let mask = "";
    input.map(operation => {
        const element = operation.split(' = ');
        const operationType = element[0];
        if (operationType == "mask") {
            mask = element[1]
        } else {
            const memoryIndexes = getMemoryIndexes(Number(operation.split('[')[1].split(']')[0]), mask);
            memoryIndexes.map(memoryIndex => memory[memoryIndex] = Number(element[1]));
        }
    })
    return getAnswer(memory);
}

function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input14')).toString().split('\r\n');
    console.log(`Answer 1: ${(process1(input))}`);
    console.log(`Answer 2: ${(process2(input))}`);
}

main();







