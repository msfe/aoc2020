import readline = require('readline')
import fs = require('fs');


const getSeatValue = (input: seat): number => {
    const rowBin = input.row.replace(/F/g, '0').replace(/B/g, '1').trim();
    const rowNr = parseInt(rowBin, 2);
    const colBin = input.col.replace(/L/g, '0').replace(/R/g, '1').trim();
    const colNr = parseInt(colBin, 2);
    return rowNr * 8 + colNr;
}


interface seat {
    row: string;
    col: string;
}

async function readNumberInput(filename: string): Promise<seat[]> {
    const fileStream = fs.createReadStream(filename);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const input: seat[] = [];
    for await (const line of rl) {

        input.push({ row: line.slice(0, 7), col: line.slice(7) });
    }
    return input;
}


async function main() {
    const input: seat[] = await readNumberInput('input5');
    const answer1 = input.map(seat => getSeatValue(seat)).reduce((max, current): number => { return Math.max(max, current) }, 0);
    console.log(`Answer 1: ${JSON.stringify(answer1)}`);
}

main();







