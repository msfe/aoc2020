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

interface position {
    x: number,
    y: number,

}

const rotateClockwise = (waypoint: position): position => {
    return {y: -waypoint.x, x:waypoint.y};
}

const getAns2 = (input: string[]): number => {
    let boat: position = {x: 0, y: 0};
    let wayPoint: position = {x: 10, y: 1};

    for (let index = 0; index < input.length; index++) {
        const instruction = input[index].charAt(0);
        const amount = Number(input[index].substring(1));
        if(instruction == "F"){
            boat.x += wayPoint.x * amount;
            boat.y += wayPoint.y * amount;
        } else if(instruction == "L"){
            wayPoint = rotateClockwise(wayPoint); // left at least 3
            if(amount < 270)
            wayPoint = rotateClockwise(wayPoint); // left at least 2
            if(amount < 180)
            wayPoint = rotateClockwise(wayPoint); // left == 1            
        } else if(instruction == "R"){
            for(let i = 0; i < amount/90; i++){
                wayPoint = rotateClockwise(wayPoint);
            }
        } else if(instruction == "N"){
            wayPoint.y += amount;
        } else if(instruction == "S"){
            wayPoint.y -= amount;
        } else if(instruction == "E"){
            wayPoint.x += amount;
        } else if(instruction == "W"){
            wayPoint.x -= amount;
        }
    }

    return Math.abs(boat.x)+Math.abs(boat.y);
}

async function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input12')).toString().split('\r\n');
    console.log(`Answer 1: ${getDistance(input)}`);
    console.log(`Answer 1: ${getAns2(input)}`);
}

main();







