import path = require('path');
import fs = require('fs');

const getValidNumbers = (input: string): number[] => {
    const rows = input.split("\r\n");
    const validNumbers = rows.flatMap(row => getNumbersForRow(row));
    return [...new Set(validNumbers)];
}

const getColumnTypes = (input: string): { [name: string]: number[] } => {
    const rows = input.split("\r\n");
    const columnTypes: { [name: string]: number[] } = {};
    rows.map(row => columnTypes[row.split(":")[0]] = getNumbersForRow(row));
    return columnTypes;
}

const getNumbersForRow = (row: string): number[] => {
    const numberIntervals = row.split(":")[1].split("or").map(string => string.trim());
    const numberArray = numberIntervals.flatMap(interval => convertNumberIntervalToArray(interval));
    return numberArray;
}

const convertNumberIntervalToArray = (interval: string): number[] => {
    const numbers = interval.split("-").map(nbr => Number(nbr));
    const res = [];
    for (let index = numbers[0]; index <= numbers[1]; index++) {
        res.push(index);
    }
    return res;
}

const getColumnsOfValidTickets = (validTickets: number[][]): number[][] => {
    const res: number[][] = [];
    for (let col = 0; col < validTickets[0].length; col++) {
        const cur: number[] = [];
        for (let index = 0; index < validTickets.length; index++) {
            cur.push(validTickets[index][col]);
        }
        res.push(cur);
    }
    return res;
}

const getTicketValue = (ticket: string): number[] => {
    return ticket.split(",").map(nbr => Number(nbr.trim()))
}

const getTicketValues = (nearbyTickets: string[]): number[][] => {
    return nearbyTickets.map(ticket => getTicketValue(ticket));
}

const getTicketScanningErrorRate = (validNumbers: number[], nearbyTickets: string[]): number => {
    const ticketValues = getTicketValues(nearbyTickets).flat();
    const invalidValues = ticketValues.filter(elem => !validNumbers.includes(elem));
    return invalidValues.reduce((acc, cur) => acc + cur, 0);
}

const validateTicket = (ticket: number[], validNumbers: number[]): boolean => {
    return !ticket.map(elem => validNumbers.includes(elem)).includes(false)
}

interface round {
    columnTypes: {
        [name: string]: number[];
    };
    columsOfValidTickets: number[][];
    myTicket: number[];
    ans: {
        [name: string]: number;
    };
    depth: number
}

interface response {
    name: string,
    index: number
}

const countTrue = (arr: boolean[]): number => {
    return arr.reduce((acc, cur) => cur ? acc + 1 : acc, 0)
}

const getColArray = (columsOfValidTickets: number[][], colValidNumbers: number[]): boolean[] => {
    return columsOfValidTickets.map(ticketCol => validateTicket(ticketCol, colValidNumbers));
}

const getBestAlternative = (columnTypes: { [name: string]: number[] }, columsOfValidTickets: number[][]): response => {
    const columnNames = Object.keys(columnTypes);
    const respArrays = columnNames.map(colName => getColArray(columsOfValidTickets,columnTypes[colName]))
    //console.log(respArrays)
    let numberOfPossible = Number.MAX_VALUE;
    let bestIndex = -1;
    let bestCol = "";
    for (let i = 0; i < respArrays.length; i++) {
        const thisNumberOfPossibility = countTrue(respArrays[i]);
        if(thisNumberOfPossibility == 0){
            console.log("NOPE!");
        }
        if (thisNumberOfPossibility < numberOfPossible) {
            numberOfPossible = thisNumberOfPossibility;
            bestIndex = respArrays[i].map((value,index) => value?index:-1).filter(index => index>=0)[0]
            bestCol = columnNames[i];
        }
    }
    console.log(`Name: ${bestCol} and Index: ${bestIndex} and Possibiliteis: ${numberOfPossible}`)
    return { name: bestCol, index: bestIndex };
}

const mapColumns = (columnTypesIn: { [name: string]: number[] }, columsOfValidTicketsIn: number[][], myTicketIn: number[], ansIn: { [name: string]: number }, nbrOfColls: number): { [name: string]: number } => {

    const queue: round[] = [];
    queue.push({ columnTypes: columnTypesIn, columsOfValidTickets: columsOfValidTicketsIn, myTicket: myTicketIn, ans: ansIn, depth: 0 });

    while (queue.length > 0) {
        const next = queue.pop() as round;
        const columnTypes = next.columnTypes;
        const columsOfValidTickets = next.columsOfValidTickets;
        const myTicket = next.myTicket;
        const ans = next.ans;
        const alternatives = getBestAlternative(columnTypes, columsOfValidTickets);
        const colName = alternatives.name;
        const index = alternatives.index;
        //console.log(JSON.stringify(myTicket))
        const nextColumnTypes = JSON.parse(JSON.stringify(columnTypes));
        const nextAns = JSON.parse(JSON.stringify(ans));
        const nextmyTicket = JSON.parse(JSON.stringify(myTicket));
        const nextColumnsOfValidTickets = JSON.parse(JSON.stringify(columsOfValidTickets));
        delete nextColumnTypes[colName];
        nextAns[colName] = myTicket[index];
        nextmyTicket.splice(index, 1);
        nextColumnsOfValidTickets.splice(index, 1);
        //console.log(JSON.stringify(nextAns))
        queue.push({ columnTypes: nextColumnTypes, columsOfValidTickets: nextColumnsOfValidTickets, myTicket: nextmyTicket, ans: nextAns, depth: next.depth + 1 });
        if (Object.keys(nextAns).length == nbrOfColls) {
            console.log(JSON.stringify(nextAns))
            return nextAns;
        }
    }
return ansIn;
}

const getMyTicketValue = (columnTypes: { [name: string]: number[] }, nearbyTickets: string[], myTicket: number[]): number => {
    const validNumbers = Object.values(columnTypes).flat();
    const ticketValues = getTicketValues(nearbyTickets);
    const validTickets = ticketValues.filter(ticket => validateTicket(ticket, validNumbers));
    const columsOfValidTickets = getColumnsOfValidTickets(validTickets);
    const answers = mapColumns(columnTypes, columsOfValidTickets, myTicket, {}, myTicket.length);
    return Object.entries(answers).reduce((acc, cur) => cur[0].includes("departure") ? acc * cur[1] : acc, 1);
}

function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input16')).toString().split('\r\n\r\n');
    const validNumbers: number[] = getValidNumbers(input[0]);
    const nearbyTickets: string[] = input[2].split(":")[1].trim().split("\r\n").map(line => line.trim());
    const myTicket: number[] = getTicketValue(input[1].split(":")[1].trim());
    console.log(`Answer 1: ${getTicketScanningErrorRate(validNumbers, nearbyTickets)}`);
    const columnTypes: { [name: string]: number[] } = getColumnTypes(input[0]);
    console.log(`Answer 2: ${getMyTicketValue(columnTypes, nearbyTickets, myTicket)}`);
}

main();







