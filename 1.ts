import path = require('path');
import fs = require('fs');

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
    return -1;
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
    return -1;
}

async function main() {
    const input: number[] = fs.readFileSync(path.resolve(__dirname, 'input1')).toString().split('\r\n').map(s => parseInt(s));
    console.log(`Answer 1: ${findTwo(input)}`);
    console.log(`Answer 2: ${findThree(input)}`);
}

main();







