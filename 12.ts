import fs = require('fs');
import path = require('path');
import { cursorTo } from 'readline';


const getStateInstructions = (input: string[]): string[] => {
    const directions = ["E","S","W","N"];
    let currentDirection = 0;
    const res: string[] = [];
    for(let i = 0; i < input.length; i++){
        if(input[i].charAt(0) == "F"){
            res.push(`${directions[currentDirection]}${input[i].substring(1)}`)
        } else if(input[i].charAt(0) == "L"){
            currentDirection = (currentDirection + 4 - Number(input[i].substring(1))/90)%4
        } else if(input[i].charAt(0) == "R"){
            currentDirection = (currentDirection + 4 + Number(input[i].substring(1))/90)%4
        }
    }
    return res;
}

const getValueDirection = (input: string[], direction: string): number => {    
    const dirArray = input.filter(line => line.charAt(0) == direction)
    return dirArray.length>0?dirArray.map(line => Number(line.substring(1)))
        .reduce((acc,cur) => acc+cur):0;
}

const getDistance = (input: string[]): number => {
    const stateInstructions = getStateInstructions(input);
    const fullStateLess = [...input, ...stateInstructions];
    const westEast = getValueDirection(fullStateLess,'E')-getValueDirection(fullStateLess,'W');
    const southNorth = getValueDirection(fullStateLess,'N')-getValueDirection(fullStateLess,'S');
    return Math.abs(westEast)+Math.abs(southNorth);
}

async function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input12')).toString().split('\r\n');
    console.log(`Answer 1: ${getDistance(input)}`);
}

main();







