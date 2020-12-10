import readline = require('readline')
import fs = require('fs');

const getUnique = (input: string[]): string[] => {
    const uniq = new Set();
    for (let i = 0; i < input.length; i++) {
        for (let index = 0; index < input[i].length; index++) {
            uniq.add(input[i][index]);
        }
    }
    return Array.from(uniq) as string[];
}

const getSortedString = (str: string): string => {
    return str.split('').sort((a, b) => a.charCodeAt(0) > b.charCodeAt(0) ? 1 : -1).join('')
}

const numberOfUniqueAnswers = (input: string[]): number => {
    return getUnique(input).length;
}

const numberOfAllAnswers = (input: string[]): number => {
    const uniq = getUnique(input);
    const mergedInput = getSortedString(input.join(''));
    return Array.from(uniq).filter((char) => mergedInput.match(`${char}{${input.length}}`)).length;
}

function readInput(filename: string): string {
    return fs.readFileSync(filename).toString();
}


function main() {
    const input: string[] = readInput('input6').split(/\r\n\r\n/g);
    const cleanedInput: string[][] = input.map(str => str.split('\r\n'));
    const answers1: number[] = cleanedInput.map(str => numberOfUniqueAnswers(str));
    console.log(`Answer 1: ${JSON.stringify(answers1.reduce((acc, curr) => acc + curr, 0))}`);
    const answers2: number[] = cleanedInput.map(str => numberOfAllAnswers(str));
    console.log(`Answer 2: ${JSON.stringify(answers2.reduce((acc, curr) => acc + curr, 0))}`);
}

main();

