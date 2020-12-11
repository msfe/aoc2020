import readline = require('readline')
import fs = require('fs');


const getAns1 = (input: number[]): number => {
    let ones = 0;
    let threes = 0;
    const sortedInput = input.sort((a, b) => a > b ? 1 : -1);
    console.log(`Sorted: ${JSON.stringify(sortedInput)}`);
    for (let index = 1; index < input.length; index++) {
        const previousElement = sortedInput[index - 1];
        const element = sortedInput[index];
        console.log(`Diff: ${element - previousElement}`);
        if (element - previousElement == 1) {
            ones++;
        }
        if (element - previousElement == 3) {
            threes++;
        }
    }
    console.log(`Ones: ${ones} Threes: ${threes}`);
    return ones * threes;
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


async function main() {
    const input: number[] = await readNumberInput('input10');
    input.push(0);
    input.push(input.reduce((max, nbr) => Math.max(max, nbr)) + 3);
    console.log(`Answer 1: ${getAns1(input)}`);
}

main();







