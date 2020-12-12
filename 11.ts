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

const allAdjacentFree = (map: string[], row: number, col: number): boolean => {
    if (row > 0) {
        if (map[row - 1].charAt(col) == "#")
            return false
        if (col > 0 && map[row - 1].charAt(col - 1) == "#")
            return false
        if (col < map[row].length - 1 && map[row - 1].charAt(col + 1) == "#")
            return false
    }
    if (row < map.length - 1) {
        if (map[row + 1].charAt(col) == "#")
            return false
        if (col > 0 && map[row + 1].charAt(col - 1) == "#")
            return false
        if (col < map[row].length - 1 && map[row + 1].charAt(col + 1) == "#")
            return false
    }
    if (col > 0 && map[row].charAt(col - 1) == "#")
        return false
    if (col < map[row].length - 1 && map[row].charAt(col + 1) == "#")
        return false

    return true;
}

const atLeastFourOccupied = (map: string[], row: number, col: number): boolean => {
    let occupied = 0;
    if (row > 0) {
        if (map[row - 1].charAt(col) == "#")
            occupied++;
        if (col > 0 && map[row - 1].charAt(col - 1) == "#")
            occupied++;
        if (col < map[row].length - 1 && map[row - 1].charAt(col + 1) == "#")
            occupied++;
    }
    if (row < map.length - 1) {
        if (map[row + 1].charAt(col) == "#")
            occupied++;
        if (col > 0 && map[row + 1].charAt(col - 1) == "#")
            occupied++;
        if (col < map[row].length - 1 && map[row + 1].charAt(col + 1) == "#")
            occupied++;
    }
    if (col > 0 && map[row].charAt(col - 1) == "#")
        occupied++;
    if (col < map[row].length - 1 && map[row].charAt(col + 1) == "#")
        occupied++;

    return occupied >= 4;
}

const getOccupiedSeats = (map: string[]): number => {
    return (map.join('').match(/#/g) || []).length;
}

const iterateMap = (mapState: map): map => {
    const nextMapState = JSON.parse(JSON.stringify(mapState));
    for (let row = 0; row < mapState.map.length; row++) {
        for (let col = 0; col < mapState.map[row].length; col++) {
            if (mapState.map[row].charAt(col) == 'L' && allAdjacentFree(mapState.map, row, col)) //Seat is free and should change
                nextMapState.map[row] = setCharAt(nextMapState.map[row], col, "#");
            if (mapState.map[row].charAt(col) == '#' && atLeastFourOccupied(mapState.map, row, col)) //Seat is free and should change
                nextMapState.map[row] = setCharAt(nextMapState.map[row], col, "L");
        }
    }
    nextMapState.occupiedSeats = getOccupiedSeats(nextMapState.map);
    nextMapState.isStable = nextMapState.occupiedSeats == mapState.occupiedSeats;
    return nextMapState;
}

const getStableCount = (mapState: map): number => {
    let currentMap = mapState;
    for (; ;) {
        //console.log('We got a map!')
        //console.log(currentMap.map.join('\n'))
        currentMap = iterateMap(currentMap);
        if (currentMap.isStable)
            return currentMap.occupiedSeats;
    }
}

async function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input11')).toString().split('\r\n');
    console.log(`Answer 1: ${getStableCount({ occupiedSeats: 0, map: input, isStable: false })}`);
}

main();







