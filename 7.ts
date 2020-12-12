import path = require('path')
import fs = require('fs');

interface bagItem {
    description: string,
    amount: number
}

interface bag {
    type: string,
    items: bagItem[]
}

function generateBagItemDictionary(input: string[]): bag[] {
    return input.map(line => {
        const parts = line.split('contain');
        const bagItems: bagItem[] = getBagItems(parts[1]);
        return { "type": trimItem(parts[0]), "items": bagItems };
    })
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

const getBagColors = (bagMap: bag[], bag: string): number => {
    const result: number[] = bagMap.map(curBag => canHoldThisBag(bagMap, bag, curBag.type) ? 1 : 0)
    return result.reduce((acc, cur) => acc + cur, 0);
}

const canHoldThisBag = (bagMap: bag[], searchFor: string, searchIn: string): boolean => {
    const possibilities = bagMap.filter(bag => bag.type == searchIn)[0].items as bagItem[];
    if (possibilities.filter(({ description }) => description == searchFor).length > 0) {
        return true;
    }
    return possibilities.map(({ description }) => canHoldThisBag(bagMap, searchFor, description)).some((value) => value == true);
}

const getBagsInBag = (bagMap: bag[], searchIn: string): number => {
    return bagMap.filter((bag) => bag.type == searchIn)[0].items.map((bag) => bag.amount + bag.amount * getBagsInBag(bagMap, bag.description)).reduce((agr, current) => agr + current, 0);
}



function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input7')).toString().split('\r\n');
    const bagItemDictionary: bag[] = generateBagItemDictionary(input);
    console.log(`Answer 1: ${getBagColors(bagItemDictionary, 'shiny gold bag')}`);
    console.log(`Answer 2: ${getBagsInBag(bagItemDictionary, 'shiny gold bag')}`);
}

main();







