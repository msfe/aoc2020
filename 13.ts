import path = require('path');
import fs = require('fs');

interface bussTime {
    bussNbr : number,
    waitTime : number,
}

const getAns1 = (busses: number[], target: number): number => {
    const waitTimes: bussTime[] = busses.map(buss => {return {bussNbr: buss, waitTime: (target%buss-buss)*-1}})
    console.log(JSON.stringify(waitTimes));
    const shortestWait: bussTime = waitTimes.reduce((best, option) => best.waitTime<option.waitTime?best:option,{bussNbr: -1, waitTime: Number.MAX_VALUE});
    return shortestWait.bussNbr*shortestWait.waitTime;
}

const getAns2 = (busses: number[]): number => {
    const startFrom = 1000;
    const maxValue = busses.reduce((max,cur) => Math.max(max,cur),0);
    const indexOfMaxValue = busses.indexOf(maxValue);
    const extra = startFrom%maxValue 
    let found = false;
    for(let possibleTimeStamp = startFrom-extra; ; possibleTimeStamp+= maxValue){
        //console.log(`Testing ${possibleTimeStamp} with Modulus ${possibleTimeStamp%maxValue}`);
        found = true;
        for(let j = 0; j<busses.length; j++){
            if(busses[j] == -1)
                continue;
            if((possibleTimeStamp+j-indexOfMaxValue)%busses[j] != 0){
                found = false; 
                break;
            }
        }
        if(found)
            return possibleTimeStamp-indexOfMaxValue;
        if(9007199254730991<possibleTimeStamp){
            return 0
        }
    }
}

function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input13')).toString().split('\r\n');
    const target: number = Number(input[0]);
    const busses: number[] = input[1].split(',').filter(line => line.trim() != "x").map(buss => Number(buss));
    const busses2: number[] = input[1].split(',').map(buss => buss.trim() != "x"?Number(buss):-1);
    console.log(`Answer 1: ${getAns1(busses, target)}`);
    console.log(`Answer 1: ${getAns2(busses2)}`);
}

main();







