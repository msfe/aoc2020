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

const getTicketValues = (nearbyTickets: string[]): number[][] => {
    return nearbyTickets.map(ticket => ticket.split(",").map(nbr => Number(nbr.trim())));
}

const getTicketScanningErrorRate = (validNumbers: number[], nearbyTickets: string[]): number => {
    const ticketValues = getTicketValues(nearbyTickets).flat();
    const invalidValues = ticketValues.filter(elem => !validNumbers.includes(elem));
    return invalidValues.reduce((acc, cur) => acc + cur, 0);
}

const getMyTicketValue = (columnTypes: { [name: string]: number[] }, nearbyTickets: string[]): number => {
    const validNumbers = Object.values(columnTypes).flat();
    const ticketValues = getTicketValues(nearbyTickets);
    const validTickets = ticketValues.filter(ticket => !ticket.map(elem => validNumbers.includes(elem)).includes(false));
    console.log(JSON.stringify(validTickets))
    const columsOfValidTickets = getColumnsOfValidTickets(validTickets);
    console.log(JSON.stringify(columsOfValidTickets))
    //return invalidValues.reduce((acc, cur) => acc + cur, 0);
    return 0;
}

function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input16')).toString().split('\r\n\r\n');
    const validNumbers: number[] = getValidNumbers(input[0]);
    const nearbyTickets: string[] = input[2].split(":")[1].trim().split("\r\n").map(line => line.trim());
    console.log(`Answer 1: ${getTicketScanningErrorRate(validNumbers, nearbyTickets)}`);
    const columnTypes: { [name: string]: number[] } = getColumnTypes(input[0]);
    console.log(`Answer 2: ${getMyTicketValue(columnTypes, nearbyTickets)}`);
}

main();







