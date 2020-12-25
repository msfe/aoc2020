import path = require('path');
import fs = require('fs');

const updateRes = (options: string[][]): string[] => {
    return options.reduce((res,cur) => {
        const nextRes: string[] = [];
        for (let i = 0; i < cur.length; i++) {
            const tempRes = JSON.parse(JSON.stringify(res)) as string[];
            tempRes.forEach(alternative => {
                nextRes.push(alternative.concat(cur[i]))
            });
        }
        return nextRes
    },[""])
}

const resolvePart = (rules: { [index: number]: string }, nextOperation: string): string[] => {
    const indexes = nextOperation.trim().split(" ");
    const options = indexes.map(i => (getValidOptions(rules, Number(i))))
    const response = updateRes(options);
    return response;
}

const getParts = (nextOperation: string): number[] => {
    return nextOperation.trim().split(" ").map(i => Number(i));
}

const getValidOptions = (rules: { [index: number]: string }, index: number): string[] => {
    const nextOperation = rules[index];
    if (nextOperation.match(/[ab]/g)) {
        return [nextOperation];
    }
    if (nextOperation.indexOf("|") == -1) {
        return resolvePart(rules, nextOperation)
        
    } else {
        const a = nextOperation.split("|");
        return resolvePart(rules, a[0]).concat(resolvePart(rules, a[1]))    
    }
}

const getValidLines = (rules: { [index: number]: string }, data: string[]): number => {
    const validData = getValidOptions(rules, 0);
    console.log("Valid Data" + JSON.stringify(validData))
    return 0;
}

function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input19')).toString().split('\r\n\r\n');
    const data: string[] = input[1].split("\r\n");
    const rules: { [index: number]: string } = {}
    input[0].split("\r\n").map(rule => {
        const index = rule.split(":")[0].trim()
        const value = rule.split(":")[1].replace(/\"/g, "").trim()
        rules[Number(index)] = value;
    })
    console.log(`Answer 1: ${getValidLines(rules, data)}`);
    //console.log(`Answer 2: ${findThree(input)}`);
}

main();







