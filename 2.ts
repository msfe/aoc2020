import readline = require('readline')
import fs = require('fs');


const isOkPolicy1 = (input: policyPass): boolean => {
    const numberOfTimes = input.password.split('').reduce((count, char) => { return (char == input.character) ? count + 1 : count }, 0);
    return numberOfTimes >= input.minTimes && numberOfTimes <= input.maxTimes;
}

const isOkPolicy2Helper = (password: string, character: string, location: number): boolean => {
    return password.charAt(location) == character;
}

const isOkPolicy2 = (input: policyPass): boolean => {
    return isOkPolicy2Helper(input.password, input.character, input.minTimes - 1) != isOkPolicy2Helper(input.password, input.character, input.maxTimes - 1);
}


interface policyPass {
    character: string;
    minTimes: number;
    maxTimes: number;
    password: string;
}

async function readInput(filename: string): Promise<policyPass[]> {
    const fileStream = fs.createReadStream(filename);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const input: policyPass[] = [];
    for await (const line of rl) {
        const inputParts = line.split(':');
        const password = inputParts[1].trim();
        const policy = inputParts[0].trim().split(' ');
        const character = policy[1];
        const minTimes = Number(policy[0].split('-')[0]);
        const maxTimes = Number(policy[0].split('-')[1]);
        input.push({ character, maxTimes, minTimes, password });
    }
    return input;
}


async function main() {
    const input: policyPass[] = await readInput('input2');
    const policy1 = input.filter(item => isOkPolicy1(item));
    const policy2 = input.filter(item => isOkPolicy2(item));
    console.log(`Answer 1: ${policy1.length}`);
    console.log(`Answer 2: ${policy2.length}`);

}

main();







