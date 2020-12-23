import path = require('path');
import fs = require('fs');

const convertNonParenthisis = (mathString: string): string => {
    const withEndParentheses = mathString.replace(/ /g,"").replace(/(\d+)/g,"$1)")
    const numberOfOperators = mathString.replace(/[^\+\*]/g,"").length
    return "(".repeat(numberOfOperators+1) + withEndParentheses
}

const evaluatedConverToHomeWorkMath = (mathString: string): number => {
    return eval(convertNonParenthisis(convertToHomeWorkMath(mathString)))
}

const convertToHomeWorkMath = (mathString: string): string => {
    if(mathString.indexOf("(") != -1){
        const lastParenthisisIndex = mathString.lastIndexOf("(");
        const matchingClosing = mathString.indexOf(")", lastParenthisisIndex);
        const resolvedString = mathString.substring(0,lastParenthisisIndex) + evaluatedConverToHomeWorkMath(mathString.substring(lastParenthisisIndex+1,matchingClosing)) + mathString.substring(matchingClosing+1)
        return convertToHomeWorkMath(resolvedString);
    }
    return mathString;
}

const getAnswer = (input: string[]): number => {
    const answers = input.map(expression => evaluatedConverToHomeWorkMath(expression))
    console.log(answers);
    return answers.reduce((acc, cur) => acc+cur,0);
}

function main() {
    const input: string[] = fs.readFileSync(path.resolve(__dirname, 'input18')).toString().split('\r\n')
    console.log(`Answer 1: ${getAnswer(input)}`);
    //console.log(`Answer 2: ${findThree(input)}`);
}

main();







