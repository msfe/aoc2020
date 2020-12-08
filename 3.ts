import readline = require('readline')
import fs = require('fs');


const numberOfTrees = (input: string[], right: number, down: number): number => {
    let x = right;
    let trees = 0;
    for (let index = down; index < input.length; index += down) {
        if (input[index].charAt(x) == '#') {
            trees++;
        }
        x = (x + right) % input[index].length;
    }
    return trees;
}


async function readNumberInput(filename: string): Promise<string[]> {
    const fileStream = fs.createReadStream(filename);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const input: string[] = [];
    for await (const line of rl) {
        input.push(line);
    }
    return input;
}


async function main() {
    const input: string[] = await readNumberInput('input3');
    const slope1 = numberOfTrees(input, 1, 1);
    const slope2 = numberOfTrees(input, 3, 1);
    const slope3 = numberOfTrees(input, 5, 1);
    const slope4 = numberOfTrees(input, 7, 1);
    const slope5 = numberOfTrees(input, 1, 2);
    console.log(`Slope 1: ${slope1}`);
    console.log(`Slope 2: ${slope2}`);
    console.log(`Slope 3: ${slope3}`);
    console.log(`Slope 4: ${slope4}`);
    console.log(`Slope 5: ${slope5}`);

    console.log();
    console.log(`Answer 1: ${slope2}`);
    console.log(`Answer 2: ${slope1 * slope2 * slope3 * slope4 * slope5}`);
}

main();











