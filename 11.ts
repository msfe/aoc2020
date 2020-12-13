import fs = require('fs');
import path = require('path');
import { cursorTo } from 'readline';

interface map {
    occupiedSeats: number,
    map: string[],
    isStable: boolean,
}
const setCharAt = (str: string, index: number, chr: string): string => {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

const isOccupied = (map: string[], row: number, col: number, dirRow: number, dirCol: number, assignment: number): boolean => {
    if (row == 0 && dirRow == -1)
        return false;
    if (col == 0 && dirCol == -1)
        return false;
    if (row == map.length - 1 && dirRow == 1)
        return false;
    if (col == map[row].length - 1 && dirCol == 1)
        return false;
    
    const tile = map[row + dirRow].charAt(col + dirCol);
    if(assignment == 2){
        if(tile == "#")
            return true;
        else if(tile == "L")
            return false;
        else
            return isOccupied(map,row+dirRow,col+dirCol,dirRow,dirCol,assignment);

    } else {
        return tile == "#";
    }
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

const iterateMap = (mapState: map, assignment: number): map => {
    const consideredOccupied = assignment == 1?4:5;
    const nextMapState = JSON.parse(JSON.stringify(mapState));
    for (let row = 0; row < mapState.map.length; row++) {
        for (let col = 0; col < mapState.map[row].length; col++) {
            if (mapState.map[row].charAt(col) == 'L' && numberOfOccupied(mapState.map, row, col, assignment) == 0) //Seat is free and should change
                nextMapState.map[row] = setCharAt(nextMapState.map[row], col, "#");
            if (mapState.map[row].charAt(col) == '#' && numberOfOccupied(mapState.map, row, col, assignment) >= consideredOccupied) //Seat is free and should change
                nextMapState.map[row] = setCharAt(nextMapState.map[row], col, "L");
        }
    }
    nextMapState.occupiedSeats = getOccupiedSeats(nextMapState.map);
    nextMapState.isStable = nextMapState.occupiedSeats == mapState.occupiedSeats;
    return nextMapState;
}

const getStableCount = (mapState: map, assignment: number): number => {
    let currentMap = mapState;
    for (; ;) {
        currentMap = iterateMap(currentMap, assignment);
        if (currentMap.isStable)
            return currentMap.occupiedSeats;
    }
}

async function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input11')).toString().split('\r\n');
    console.log(`Answer 1: ${getStableCount({ occupiedSeats: 0, map: input, isStable: false },1)}`);
    console.log(`Answer 2: ${getStableCount({ occupiedSeats: 0, map: input, isStable: false },2)}`);
}

main();







