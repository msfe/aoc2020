import readline = require('readline')
import fs = require('fs');
const { once } = require('events');


const findTwo = (input: number[]): number => {
    for (let index = 0; index < input.length; index++) {
        const element = input[index];
        for (let index2 = index + 1; index2 < input.length; index2++) {
            const element2 = input[index2];
            if (element + element2 == 2020) {
                return element * element2;
            }
        }
    }
}

const findThree = (input: number[]): number => {
    for (let index = 0; index < input.length; index++) {
        const element = input[index];
        for (let index2 = index + 1; index2 < input.length; index2++) {
            const element2 = input[index2];
            for (let index3 = index + 1; index3 < input.length; index3++) {
                const element3 = input[index3];
                if (element + element2 + element3 == 2020) {
                    return element * element2 * element3;
                }
            }
        }
    }
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
    const input: number[] = await readNumberInput('input1');
    console.log(`Answer 1: ${findTwo(input)}`);
    console.log(`Answer 2: ${findThree(input)}`);
}

main();







