/*
We need to dump the file into a 2d array, then we run it char by char, line by line.
we find the symbols, if we find a symbol we check around it, for each succesful check we recursively check 
in that line until we encounter a "." then we store the numbers and we erase them from the string
*/
import fs from 'node:fs';
import readline from 'node:readline';

const symbols: string[] = ['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-',
    '_', '=', '+', '[', '{', '}', ']', '\\', '|', ';', ':', '\'', '\"', ',', '<', '>', '/', '?'];
//const partsArray = await loadPartsArray('day3test.txt');
//const partsArray = await loadPartsArray('day3othertest.txt');
const partsArray = await loadPartsArray('day3.txt');


console.log(getPartNumberTotal(partsArray));

async function loadPartsArray(fileName: string): Promise<string[][]> {
    const fileStream = fs.createReadStream(fileName);
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const array: string[][] = new Array<string[]>();

    for await (const line of rl) {
        array.push(line.split(""));
    }

    return array;
}

function getPartNumberTotal(array: string[][]): number {
    let total: number = 0;
    let totalGearRatios: number = 0; //Part 2

    for (let y = 0; y < array.length; y++) {
        for (let x = 0; x < array[y].length; x++) {
            const gearNumbers = new Array<number>(); //Part 2

            if (symbols.includes(array[y][x])) {
                //check around the symbol for numbers
                const hits = findAroundSymbol(array, y, x);

                //Find the numbers based on the hits around the symbol
                //TOP ROW
                if (hits[0] && hits[1] && hits[2]) { //Case 3
                    var { number, arrayRet } = findNumberRight(array, y - 1, x - 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (hits[0] && hits[1] && !hits[2]) { //Case 2
                    let { number, arrayRet } = findNumberLeft(array, y - 1, x);                    
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (hits[0] && !hits[1] && hits[2]) { //Case 1 and Case 5
                    var { number, arrayRet } = findNumberLeft(array, y - 1, x - 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                    var { number, arrayRet } = findNumberRight(array, y - 1, x + 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (hits[0] && !hits[1] && !hits[2]) { //Case 1
                    var { number, arrayRet } = findNumberLeft(array, y - 1, x - 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (!hits[0] && hits[1] && hits[2]) { //Case 4
                    var { number, arrayRet } = findNumberRight(array, y - 1, x);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (!hits[0] && !hits[1] && hits[2]) { //Case 5
                    var { number, arrayRet } = findNumberRight(array, y - 1, x + 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (!hits[0] && hits[1] && !hits[2]) { //Case 14
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(Number(array[y-1][x])); }
                    //Part 1
                    total += Number(array[y-1][x])
                }

                //MIDDLE
                if (hits[3]) {
                    var { number, arrayRet } = findNumberLeft(array, y, x - 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                }
                if (hits[4]) {
                    var { number, arrayRet } = findNumberRight(array, y, x + 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                }

                //BOTTOM ROW
                if (hits[5] && hits[6] && hits[7]) { //Case 10
                    var { number, arrayRet } = findNumberRight(array, y + 1, x - 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (hits[5] && hits[6] && !hits[7]) { //Case 9
                    var { number, arrayRet } = findNumberLeft(array, y + 1, x);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (hits[5] && !hits[6] && hits[7]) { //Case 8 and Case 12
                    var { number, arrayRet } = findNumberLeft(array, y + 1, x - 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                    var { number, arrayRet } = findNumberRight(array, y + 1, x + 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (hits[5] && !hits[6] && !hits[7]) { //Case 8
                    var { number, arrayRet } = findNumberLeft(array, y + 1, x - 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (!hits[5] && hits[6] && hits[7]) { //Case 11
                    var { number, arrayRet } = findNumberRight(array, y + 1, x);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (!hits[5] && !hits[6] && hits[7]) { //Case 12
                    var { number, arrayRet } = findNumberRight(array, y + 1, x + 1);
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(number); }
                    //Part 1
                    total += number;
                    array = arrayRet;
                } else if (!hits[5] && hits[6] && !hits[7]) {//Case 13 
                    //Part 2
                    if(array[y][x] == '*') { gearNumbers.push(Number(array[y+1][x+1])); }
                    //Part 1
                    total += Number(array[y+1][x+1]);
                }

                if(gearNumbers.length == 2) {
                    totalGearRatios += gearNumbers[0] * gearNumbers[1];
                }
            }

            

        }

    }
    //Part 1
    //return total; 
    //Part 2
    return totalGearRatios; 
}

function findAroundSymbol(array: string[][], y: number, x: number): boolean[] {
    let hits: boolean[] = [false, false, false, false, false, false, false, false];

    if (y > 0 && x > 0) {
        hits[0] = array[y - 1][x - 1].match(/[0-9]/i) != null;
    }
    if (y > 0) {
        hits[1] = array[y - 1][x].match(/[0-9]/i) != null;
    }
    if (y > 0 && x + 1 < array[y].length) {
        hits[2] = array[y - 1][x + 1].match(/[0-9]/i) != null;
    }
    if (x > 0) {
        hits[3] = array[y][x - 1].match(/[0-9]/i) != null;
    }
    if (x + 1 < array[y].length) {
        hits[4] = array[y][x + 1].match(/[0-9]/i) != null;
    }
    if (y + 1 < array.length && x > 0) {
        hits[5] = array[y + 1][x - 1].match(/[0-9]/i) != null;
    }
    if (y + 1 < array.length) {
        hits[6] = array[y + 1][x].match(/[0-9]/i) != null;
    }
    if (y + 1 < array.length && x + 1 < array[y].length) {
        hits[7] = array[y + 1][x + 1].match(/[0-9]/i) != null;
    }
    return hits;
}

function findNumberLeft(array: string[][], y: number, x: number): { number: number, arrayRet: string[][] } {
    let fullNumber: string = "";
    let lastChar = array[y][x];
    let lastXPos = x;
    while (lastChar.match(/[0-9]/i) && lastXPos >= 0) {
        fullNumber = lastChar + fullNumber;
        array[y][lastXPos] = "."

        lastXPos--;
        lastChar = lastXPos >= 0 ? array[y][lastXPos] : "*";
    }
    console.log(Number(fullNumber) + " at X:" + (lastXPos + 1) + " Y:" + y);
    return { number: Number(fullNumber), arrayRet: array };
}

function findNumberRight(array: string[][], y: number, x: number): { number: number, arrayRet: string[][] } {
    let fullNumber: string = "";
    let lastChar = array[y][x];
    let lastXPos = x;
    while (lastXPos < array[y].length && lastChar.match(/[0-9]/i)) {
        fullNumber += lastChar;
        array[y][lastXPos] = "."

        lastXPos++;
        lastChar = lastXPos < array.length ? array[y][lastXPos] : "*";
    }
    console.log(Number(fullNumber) + " at X:" + (lastXPos - 1) + " Y:" + y);
    return { number: Number(fullNumber), arrayRet: array };
}

