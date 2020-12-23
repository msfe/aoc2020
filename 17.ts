import fs = require('fs');
import path = require('path');

const genereateEmptyMap = (size: number): string[][] => {
    const zPlane = [];
    const row = ".".repeat(size);
    for(let i = 0; i < size; i++){
        zPlane.push(row);
    }
    const map = [];
    for(let i = 0; i < size; i++){
        map.push(JSON.parse(JSON.stringify(zPlane)));
    }
    return map;
}

const getStartMap = (input: string[], size: number): string[][] => {
    if(size%2 == 0){
        console.error(`Size should be an odd number, but ${size} was given.`)
    }
    const map = genereateEmptyMap(size) as string[][];
    const midPlane = Math.floor((map.length)/2);
    const fill = map.length-input.length;
    const fillHalf = fill/2;
    for(let i = fillHalf; i < map.length-fillHalf; i++){        
        map[midPlane][i] = ".".repeat(fillHalf) + input[i-fillHalf] + ".".repeat(fillHalf);
    }
    return map;
}
/*
const setCharAt = (str: string, index: number, chr: string): string => {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

const isOccupied = (map: string[], row: number, col: number, dirRow: number, dirCol: number, assignment: number): boolean => {
    if ((row == 0 && dirRow == -1)||(col == 0 && dirCol == -1)||(row == map.length - 1 && dirRow == 1)||(col == map[row].length - 1 && dirCol == 1))
        return false;
    
    const tile = map[row + dirRow].charAt(col + dirCol);
    if(assignment == 2){
        if(tile == "#")
            return true;
        else if(tile == "L")
            return false;
        else
            return isOccupied(map,row+dirRow,col+dirCol,dirRow,dirCol,assignment);

    }
    return tile == "#";
}

const numberOfOccupied = (map: string[], row: number, col: number, assignment: number): number => {
    let occupied = 0;
    if (isOccupied(map, row, col, -1, -1, assignment))
        occupied++
    if (isOccupied(map, row, col, -1, 0, assignment))
        occupied++
    if (isOccupied(map, row, col, -1, 1, assignment))
        occupied++
    if (isOccupied(map, row, col, 0, -1, assignment))
        occupied++
    if (isOccupied(map, row, col, 0, 1, assignment))
        occupied++
    if (isOccupied(map, row, col, 1, -1, assignment))
        occupied++
    if (isOccupied(map, row, col, 1, 0, assignment))
        occupied++
    if (isOccupied(map, row, col, 1, 1, assignment))
        occupied++

    return occupied;
}

const getOccupiedSeats = (map: string[]): number => {
    return (map.join('').match(/#/g) || []).length;
}

const simulateRound = (mapState: string[][]): string[][] => {
    //const consideredOccupied = assignment == 1?4:5;
    const nextMapState = JSON.parse(JSON.stringify(mapState)) as string[][];
    for (let z = 0; z < mapState.length; z++) {
        for (let y = 0; y < mapState[z].length; y++) {
            for (let x = 0; x < mapState[z][y].length; x++) {
            if (mapState[z].charAt(y) == 'L' && numberOfOccupied(mapState, z, y, assignment) == 0) //Seat is free and should change
                nextMapState[z] = setCharAt(nextMapState[z], y, "#");
            if (mapState[z].charAt(y) == '#' && numberOfOccupied(mapState, z, y, assignment) >= consideredOccupied) //Seat is free and should change
                nextMapState[z] = setCharAt(nextMapState[z], y, "L");
            }
        }
    }
    nextMapState.occupiedSeats = getOccupiedSeats(nextMapState.map);
    nextMapState.isStable = nextMapState.occupiedSeats == mapState.occupiedSeats;
    return nextMapState;
}

const getActiveAtRound = (mapState: string[][], rounds: number): number => {
    let currentMap;
    for (let index = 0; index<rounds ;index++) {
        currentMap = simulateRound(currentMap);
    }
    return getActive(currentMap);
}*/

async function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input17')).toString().split('\r\n');
    const map = getStartMap(input, 21);
    console.log(JSON.stringify(map));
    //console.log(`Answer 1: ${getStableCount(map,6)}`);
    //console.log(`Answer 2: ${getStableCount({ occupiedSeats: 0, map: input, isStable: false },2)}`);
}

main();







