import path = require('path');
import fs = require('fs');
import { cursorTo } from 'readline';

interface tile {
    id:number,
    edges: string[]
    neighbours: number[];
}

function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input20')).toString().split('\r\n\r\n');
    const tiles = input.map(tile => parseTiles(tile));
    tiles.map(tile => updateNeighbours(tile,tiles));
    console.log(`Answer 1: ${JSON.stringify(tiles.map(tile => tile.neighbours))}`);
}

const parseTiles = (input: string): tile => {
    const parts = input.split(":\r\n");
    const id =  Number(parts[0].split(" ")[1]);
    const edges: string[] = getEdges(parts[1].split("\r\n"));
    return {id, edges, neighbours: []};
}

const getEdges = (pic : string[]) : string[] => {
    let right = "";
    let left = "";
    for (let index = 0; index < pic.length; index++) {
        const element = pic[index];
        left += element.charAt(0);
        right += element.charAt(element.length-1); 
    }
    return [pic[0], reverse(pic[0]), pic[pic.length-1], reverse(pic[pic.length-1]),right, reverse(right), left, reverse(left)]
}

const reverse = (str : string): string => {
    return str.split("").reverse().join("");
}

const updateNeighbours = (curTile: tile, tiles: tile[]) => {
    curTile.neighbours = tiles.map(tile => haveCommonEdges(curTile,tile)?tile.id:-1).filter(id => id>=0)
}

const haveCommonEdges = (first: tile, second: tile): boolean => {
    return first.edges.map(edge => second.edges.includes(edge)?true:false).filter(res => res).length > 0;
}

main();
