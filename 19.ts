import path = require('path');
import fs = require('fs');

function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input19')).toString().split('\r\n\r\n');
    const data: string[] = input[1].split("\r\n");
    const rules: { [index: number]: string } = getRules(input[0]);
    
    const validLines = getValidLines(rules, data);
    console.log(`Answer 1: ${validLines.length}`);

    const validLinesUsingLoops = getValidLinesUsingLoops(rules, data);
    console.log(`Answer 2: ${validLinesUsingLoops.length}`);
}

const getRules = (input: string): { [index: number]: string } => {
    const rules: { [index: number]: string } = {}
    input.split("\r\n").map(rule => {
        const index = rule.split(":")[0].trim()
        const value = rule.split(":")[1].replace(/\"/g, "").trim()
        rules[Number(index)] = value;
    })
    return rules
}

// PART 1

const getValidLines = (rules: { [index: number]: string }, data: string[]): string[] => {
    const allowedLines = getValidOptions(rules, 0);
    return validateLines(allowedLines, data);
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

const resolvePart = (rules: { [index: number]: string }, nextOperation: string): string[] => {
    const indexes = nextOperation.trim().split(" ");
    const options = indexes.map(i => (getValidOptions(rules, Number(i))))
    const response = updateRes(options);
    return response;
}

const updateRes = (options: string[][]): string[] => {
    return options.reduce((res, cur) => {
        const nextRes: string[] = [];
        for (let i = 0; i < cur.length; i++) {
            const tempRes = JSON.parse(JSON.stringify(res)) as string[];
            tempRes.forEach(alternative => {
                nextRes.push(alternative.concat(cur[i]))
            });
        }
        return nextRes
    }, [""])
}

const validateLines = (allowedLines: string[], data: string[]): string[] => {
    return data.filter(line => allowedLines.includes(line))
}

// PART 2

const getValidLinesUsingLoops = (rules: { [index: number]: string }, data: string[]): string[] => {
    const allowedLines42 = getValidOptions(rules, 42)
    const allowedLines31 = getValidOptions(rules, 31);
    return data.filter(line => testLineUsingLoops(allowedLines42, allowedLines31, line));
}

const testLineUsingLoops = (allowedLines42: string[], allowedLines31: string[], invalidLine: string): boolean => {

    const length31 = allowedLines31[0].length; // Same as Length42
    const chunks = splitAtLength(invalidLine, length31)

    let counter42 = 0;
    for (let index = 0; index < chunks.length; index++) {
        if (allowedLines42.includes(chunks[index])) {
            counter42++;
        } else {
            break;
        }
    }

    let counter31 = 0;
    for (let index = chunks.length - 1; index >= 0; index--) {
        if (allowedLines31.includes(chunks[index])) {
            counter31++;
        } else {
            break;
        }
    }

    if (counter42 > counter31 && counter42 > 0 && counter31 > 0 && (counter42 + counter31 >= invalidLine.length / length31))
        return true
    return false
}

const splitAtLength = (invalidLine: string, size: number): string[] => {
    const res: string[] = [];
    for (let index = 0; index < invalidLine.length; index += size) {
        res.push(invalidLine.substr(index, size));
    }
    return res;
}

main();







