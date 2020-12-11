import readline = require('readline')
import fs = require('fs');

const isValid = (preamble: number[], value: number): boolean => {
    for (let i = 0; i < preamble.length; i++) {
        for (let j = i + 1; j < preamble.length; j++) {
            if (preamble[i] + preamble[j] == value) {
                return true;
            }
        }
    }
    return false;
}

const validateValue = (input: number[], preambleSize: number, index: number): number => {
    if (isValid(input.slice(index - preambleSize, index), input[index])) {
        return validateValue(input, preambleSize, index + 1);
    } else {
        return input[index];
    }
}

const findFirstInvalid = (input: number[], preambleSize: number): number => {
    return validateValue(input, preambleSize, preambleSize + 1);
}

async function readNumberInput(filename: string): Promise<number[]> {
    const fileStream = fs.createReadStream(filename);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const input: number[] = [];
    for await (const line of rl) {
        input.push(Number(line));
    }
    return input;
}

const getValue = (vulnerable: number[]): number => {
    const min = vulnerable.reduce((min, cur) => Math.min(min, cur), Number.MAX_VALUE);
    const max = vulnerable.reduce((max, cur) => Math.max(max, cur), 0);
    return min + max;
}

const getSum = (testedNumbers: number[]): number => {
    return testedNumbers.reduce((min, cur) => min + cur, 0);
}

const findVulnerable = (input: number[], value: number, testedNumberFirst: number, testedNumberLast: number): number[] => {
    //console.log(`Input: ${input}  Current: ${input.slice(testedNumberFirst, testedNumberLast)} Looking For:${value}`)
    const currentSum = getSum(input.slice(testedNumberFirst, testedNumberLast));
    if (currentSum > value) {
        //console.log(`CurrentSum ${currentSum} to big, abandon`)
        return [];
    } else if (currentSum == value) {
        return input.slice(testedNumberFirst, testedNumberLast);
    } else {
        const ansExtend = findVulnerable(input, value, testedNumberFirst, testedNumberLast + 1);
        if (ansExtend.length > 0) {
            return ansExtend;
        }
        const ans = findVulnerable(input, value, testedNumberFirst + 1, testedNumberFirst + 2);
        if (ans.length > 0) {
            return ans;
        }
    }
    return [];
}

const findVulnerableIterative = (input: number[], value: number): number[] => {
    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
            const testCombination = input.slice(i, j);
            //console.log(`Input: ${input}  Current: ${testCombination} Looking For:${value}`)
            const currentSum = getSum(testCombination);
            if (currentSum > value) {
                //console.log(`CurrentSum ${currentSum} to big, abandon`)
                break;
            }
            if (currentSum == value) {
                return testCombination;
            }
        }
    }
    return [];
}

const findFlaw = (input: number[], value: number): number => {
    const vulnerable = findVulnerableIterative(input, value);
    console.log(JSON.stringify(vulnerable));
    return getValue(vulnerable);
}


async function main() {
    const input: number[] = await readNumberInput('input9');
    const test: number[] = await readNumberInput('input9test');
    const firstInvalidTest = findFirstInvalid(test, 5);
    const firstInvalid = findFirstInvalid(input, 25);
    console.log(`Test 1: ${firstInvalidTest}`);
    console.log(`Test 2: ${findFlaw(test, firstInvalidTest)}`);
    console.log(`Answer 1: ${firstInvalid}`);
    console.log(`Answer 2: ${findFlaw(input, firstInvalid)}`);
}

main();







