import path = require('path');
import fs = require('fs');

const playGame = (input: number[], rounds: number): number => {
    const played: { [id: number]: number; } = {};
    input.map((value, index) => index != input.length - 1 ? played[value] = index : "");
    let cur = input[input.length - 1];
    for (let i = input.length - 1; i < rounds - 1; i++) {
        const curValue = played[cur]
        played[cur] = i;
        cur = curValue == null ? 0 : i - curValue
    }
    return cur;
}

function main() {
    const input: number[] = fs.readFileSync(path.resolve(__dirname, 'input15')).toString().split(',').map(s => parseInt(s));
    console.log(`Answer 1: ${playGame(input, 2020)}`);
    console.log(`Answer 2: ${playGame(input, 30000000)}`);
}

main();








