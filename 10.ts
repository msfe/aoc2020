import readline = require('readline')
import fs = require('fs');


const getAns1 = (input: number[]): number => {
    input.sort((a, b) => a > b ? 1 : -1);
    const diffMap = input.map((nbr, index) => index == 0 ? 0 : nbr - input[index - 1]);
    let ones = diffMap.filter(nbr => nbr == 1).length;
    let threes = diffMap.filter(nbr => nbr == 3).length;
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







