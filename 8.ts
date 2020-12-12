import path = require('path')
import fs = require('fs');


const testInfLoop = (input: string[]): { acc: number, finished: boolean } => {
    let acc = 0;
    let point = 0;
    const visited: number[] = [];
    for (; true;) {
        if (point == input.length) {
            return { acc, finished: true };
        }
        visited.push(point);
        const parts = input[point].split(' ');
        let nextPoint = point;
        if (parts[0].includes('jmp')) {
            nextPoint += Number(parts[1]);
        } else if (parts[0].includes('acc')) {
            acc += Number(parts[1]);
        }
        if (nextPoint == point)
            nextPoint++;
        if (visited.includes(nextPoint)) {
            return { acc, finished: false };
        } else {
            point = nextPoint;
        }
    }
}

const testRow = (input: string[], index: number): string[] => {
    const tryInput = [...input];
    if (tryInput[index].includes('jmp')) {
        tryInput[index] = tryInput[index].replace('jmp', 'nop');
    } else if (tryInput[index].includes('nop')) {
        tryInput[index] = tryInput[index].replace('nop', 'jmp');
    }
    return tryInput;
}

const findWorkingLoop = (input: string[]): number => {
    return input.map((_, index) => testInfLoop(testRow(input, index))).filter(res => res.finished)[0].acc
}



async function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input8')).toString().split('\r\n');
    console.log(`Answer 1: ${testInfLoop(input).acc}`);
    console.log(`Answer 2: ${findWorkingLoop(input)}`);
}

main();







