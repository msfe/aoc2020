import readline = require('readline')
import fs = require('fs');

const ansMap: number[] = [0, 1, 2, 4, 7, 13, 24]; //Paths based on number of continuous 1s. Ie. 111 => ansMap[3] = 4 = [111,12,21,3].length

const getAns1 = (input: number[]): number => {
    const diffMap = getDiffMap(input)
    console.log(`Position: ${diffMap}`);
    const ones = diffMap.filter(nbr => nbr == 1).length;
    const threes = diffMap.filter(nbr => nbr == 3).length;
    return ones * threes;
}

const getAns2 = (input: number[]): number => {
    const diffMap = getDiffMap(input)
    const parts = diffMap.filter(x => x > 0).join('').split('3');
    const routes = parts.map(part => ansMap[part.length]);
    return routes.reduce((acc, cur) => cur == 0 ? acc : acc * cur, 1);
}

const getDiffMap = (input: number[]): number[] => {
    input.sort((a, b) => a > b ? 1 : -1);
    return input.map((nbr, index) => index == 0 ? 0 : nbr - input[index - 1]);
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
    console.log(`Answer 2: ${getAns2(input)}`);
}

main();







