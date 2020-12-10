import readline = require('readline')
import fs = require('fs');

interface bagItem {
    description: string,
    amount: number
}

interface Dictionary<T> {
    [Key: string]: T;
}

async function readInput(filename: string): Promise<Dictionary<bagItem[]>> {
    const fileStream = fs.createReadStream(filename);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const bags: Dictionary<bagItem[]> = {}
    for await (const line of rl) {
        const parts = line.split('contain');
        const bagItems: bagItem[] = getBagItems(parts[1]);
        bags[trimItem(parts[0])] = bagItems;
    }
    return bags;
}

const getBagItems = (input: string): bagItem[] => {
    if (input.trim() == "no other bags.")
        return [];
    return input.split(',').map(item => parseBagItem(item));;
}

const parseBagItem = (item: string): bagItem => {
    const trimmedItem = trimItem(item)
    return {
        amount: Number(trimmedItem.substr(0, trimmedItem.indexOf(' '))),
        description: trimmedItem.substr(trimmedItem.indexOf(' ') + 1)
    };
}

const trimItem = (item: string): string => {
    return item.trim().replace(/s*\.*$/g, '');
}

const getBagColors = (bagMap: Dictionary<bagItem[]>, bag: string): number => {
    let res = 0;
    for (let bagDescription in bagMap) {
        res += canHoldThisBag(bagMap, bag, bagDescription) ? 1 : 0;
    }
    return res;
}

const canHoldThisBag = (bagMap: Dictionary<bagItem[]>, searchFor: string, searchIn: string): boolean => {
    const possibilities = bagMap[searchIn] as bagItem[];
    if (possibilities.filter(({ description }) => description == searchFor).length > 0) {
        return true;
    }
    return possibilities.map(({ description }) => canHoldThisBag(bagMap, searchFor, description)).some((value, index, array) => value == true);
}

const getBagsInBag = (bagMap: Dictionary<bagItem[]>, bag: string): number => {
    const possibilities = bagMap[bag] as bagItem[];
    return possibilities.map((bag) => bag.amount + bag.amount * getBagsInBag(bagMap, bag.description)).reduce((agr, current) => agr + current, 0);
}



async function main() {
    const input: Dictionary<bagItem[]> = await readInput('input7');
    //console.log(JSON.stringify(input));
    //const answer1 = seatIds.reduce((max, current): number => { return Math.max(max, current) }, 0);
    console.log(`Answer 1: ${getBagColors(input, 'shiny gold bag')}`);
    console.log(`Answer 2: ${getBagsInBag(input, 'shiny gold bag')}`);
}

main();







