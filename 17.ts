import fs = require('fs');
import path = require('path');

const genereateEmptyMap = (size: number): string[][] => {
    const zPlane = [];
    const row = ".".repeat(size);
    for (let i = 0; i < size; i++) {
        zPlane.push(row);
    }
    const map = [];
    for (let i = 0; i < size; i++) {
        map.push(JSON.parse(JSON.stringify(zPlane)));
    }
    return map;
}

const getStartMap = (input: string[], size: number): string[][] => {
    if (size % 2 != input.length % 2) {
        size++;
    }
    const map = genereateEmptyMap(size) as string[][];
    const midPlane = Math.floor((map.length) / 2);
    const fill = map.length - input.length;
    const fillHalf = fill / 2;
    for (let i = fillHalf; i < map.length - fillHalf; i++) {
        map[midPlane][i] = ".".repeat(fillHalf) + input[i - fillHalf] + ".".repeat(fillHalf);
    }
    return map;
}

const getStartMap4d = (input: string[], size: number): string[][][] => {
    if (size % 2 != input.length % 2) {
        size++;
    }
    const map3d = genereateEmptyMap(size) as string[][];
    const map = [];
    for (let i = 0; i < size; i++) {
        map.push(JSON.parse(JSON.stringify(map3d)));
    }
    const midPlane = Math.floor((map.length) / 2);
    const fill = map.length - input.length;
    const fillHalf = fill / 2;
    for (let i = fillHalf; i < map.length - fillHalf; i++) {
        map[midPlane][midPlane][i] = ".".repeat(fillHalf) + input[i - fillHalf] + ".".repeat(fillHalf);
    }
    return map;
}

const setCharAt = (str: string, index: number, chr: string): string => {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

const isActive = (map: string[][], z: number, y: number, x: number, dirZ: number, dirY: number, dirX: number): boolean => {
    if ((z == 0 && dirZ == -1) || (y == 0 && dirY == -1) || (x == 0 && dirX == -1) || (z == map.length - 1 && dirZ == 1) || (y == map[z].length - 1 && dirY == 1) || (x == map[z][y].length - 1 && dirX == 1))
        return false;
    return map[z + dirZ][y + dirY].charAt(x + dirX) == "#";
}

const isActive4d = (map: string[][][], w:number, z: number, y: number, x: number, dirW: number, dirZ: number, dirY: number, dirX: number): boolean => {
    if ((w == 0 && dirW == -1) || (z == 0 && dirZ == -1) || (y == 0 && dirY == -1) || (x == 0 && dirX == -1) || (w == map.length - 1 && dirW == 1) || (z == map.length - 1 && dirZ == 1) || (y == map[z].length - 1 && dirY == 1) || (x == map[z][y].length - 1 && dirX == 1))
        return false;
    return map[w+dirW][z + dirZ][y + dirY].charAt(x + dirX) == "#";
}

const numberOfActive = (map: string[][], z: number, y: number, x: number): number => {
    let active = 0;
    for (let zIndex = -1; zIndex <= 1; zIndex++) {
        for (let yIndex = -1; yIndex <= 1; yIndex++) {
            for (let xIndex = -1; xIndex <= 1; xIndex++) {
                if (zIndex == 0 && yIndex == 0 && xIndex == 0) {
                    continue;
                }
                if (isActive(map, z, y, x, zIndex, yIndex, xIndex))
                    active++
            }
        }
    }
    return active;
}

const numberOfActive4d = (map: string[][][], w: number, z: number, y: number, x: number): number => {
    let active = 0;
    for (let wIndex = -1; wIndex <= 1; wIndex++) {
        for (let zIndex = -1; zIndex <= 1; zIndex++) {
            for (let yIndex = -1; yIndex <= 1; yIndex++) {
                for (let xIndex = -1; xIndex <= 1; xIndex++) {
                    if (wIndex == 0 && zIndex == 0 && yIndex == 0 && xIndex == 0) {
                        continue;
                    }
                    if (isActive4d(map, w, z, y, x, wIndex, zIndex, yIndex, xIndex))
                        active++
                }
            }
        }
    }
    return active;
}

const getActive = (map: string[][]): number => {
    return (map.flat().join('').match(/#/g) || []).length;
}

const simulateRound = (mapState: string[][]): string[][] => {
    const nextMapState = JSON.parse(JSON.stringify(mapState)) as string[][];
    for (let z = 0; z < mapState.length; z++) {
        for (let y = 0; y < mapState[z].length; y++) {
            for (let x = 0; x < mapState[z][y].length; x++) {
                const activeNeighbours = numberOfActive(mapState, z, y, x);
                if (mapState[z][y].charAt(x) == '.' && activeNeighbours == 3) // is inactive and should change
                    nextMapState[z][y] = setCharAt(nextMapState[z][y], x, "#");
                if (mapState[z][y].charAt(x) == '#' && !(activeNeighbours == 2 || activeNeighbours == 3)) // is active and should change
                    nextMapState[z][y] = setCharAt(nextMapState[z][y], x, ".");
            }
        }
    }
    return nextMapState;
}

const simulateRound4d = (mapState: string[][][]): string[][][] => {
    const nextMapState = JSON.parse(JSON.stringify(mapState)) as string[][][];
    for (let w = 0; w < mapState.length; w++) {
        for (let z = 0; z < mapState[w].length; z++) {
            for (let y = 0; y < mapState[w][z].length; y++) {
                for (let x = 0; x < mapState[w][z][y].length; x++) {
                    const activeNeighbours = numberOfActive4d(mapState, w, z, y, x);
                    if (mapState[w][z][y].charAt(x) == '.' && activeNeighbours == 3) // is inactive and should change
                        nextMapState[w][z][y] = setCharAt(nextMapState[w][z][y], x, "#");
                    if (mapState[w][z][y].charAt(x) == '#' && !(activeNeighbours == 2 || activeNeighbours == 3)) // is active and should change
                        nextMapState[w][z][y] = setCharAt(nextMapState[w][z][y], x, ".");
                }
            }
        }
    }
    return nextMapState;
}

const getActiveAtRound = (mapState: string[][], rounds: number): number => {
    let currentMap = mapState;
    for (let index = 0; index < rounds; index++) {
        currentMap = simulateRound(currentMap);
    }
    return getActive(currentMap);
}

const getActiveAtRound4d = (mapState: string[][][], rounds: number): number => {
    let currentMap = mapState;
    for (let index = 0; index < rounds; index++) {
        currentMap = simulateRound4d(currentMap);
    }
    return getActive(currentMap.flat());
}

async function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input17')).toString().split('\r\n');
    const map = getStartMap(input, 31);
    console.log(`Answer 1: ${getActiveAtRound(map, 6)}`);
    const map4d = getStartMap4d(input, 31);
    console.log(`Answer 2: ${getActiveAtRound4d(map4d, 6)}`);
}

main();







